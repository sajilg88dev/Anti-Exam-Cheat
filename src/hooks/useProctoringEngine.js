import { useState, useRef, useCallback, useEffect } from 'react';
import {
  initFaceLandmarker,
  detectForVideo,
  closeFaceLandmarker,
} from '../services/mediapipe/faceLandmarkerService';
import { classifyFaceCount, getBoundingBoxFromLandmarks } from '../utils/faceUtils';
import { estimateHeadOrientation, GazeSmoother } from '../utils/gazeUtils';
import { createLogEntry } from '../utils/eventLogger';
import {
  FACE_STATUS,
  GAZE_STATUS,
  GAZE,
  MONITORING_STATUS,
  EVENT_TYPES,
  SEVERITY,
  DETECTION,
  CAMERA_STATUS,
} from '../utils/constants';

/**
 * Core proctoring engine hook.
 *
 * Orchestrates:
 *   - MediaPipe model loading
 *   - Frame-by-frame detection loop
 *   - Face count state management
 *   - Gaze / attention state with smoothing
 *   - Continuous look-away timer
 *   - Alert triggering
 *   - Event logging
 *   - Session summary metrics
 *
 * The UI simply consumes the state returned by this hook.
 */
export function useProctoringEngine(videoRef, cameraStatus) {
  // --- State exposed to UI ---
  const [monitoringStatus, setMonitoringStatus] = useState(MONITORING_STATUS.IDLE);
  const [faceStatus, setFaceStatus] = useState(FACE_STATUS.NO_FACE);
  const [gazeStatus, setGazeStatus] = useState(GAZE_STATUS.UNKNOWN);
  const [lookAwayTimer, setLookAwayTimer] = useState(0);
  const [faceCount, setFaceCount] = useState(0);
  const [events, setEvents] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [overlayData, setOverlayData] = useState(null);

  // --- Session summary metrics ---
  const [summary, setSummary] = useState({
    multipleFaceIncidents: 0,
    noFaceIncidents: 0,
    lookAwayIncidents: 0,
    longestLookAway: 0,
  });

  // --- Internal refs (not causing rerenders) ---
  const animFrameRef = useRef(null);
  const lastFrameTimeRef = useRef(0);
  const gazeSmootherRef = useRef(new GazeSmoother());

  // Look-away timer tracking
  const lookAwayStartRef = useRef(null); // timestamp when continuous look-away started
  const lookAwayAlertedRef = useRef(false); // whether we already fired the 5s alert for this streak
  const longestLookAwayRef = useRef(0);

  // Previous state refs to avoid duplicate logs
  const prevFaceStatusRef = useRef(null);
  const prevGazeStatusRef = useRef(null);

  // Whether the loop should be running
  const isRunningRef = useRef(false);

  // --- Logging helper ---
  const addEvent = useCallback((type, message, severity = SEVERITY.INFO, metadata = null) => {
    const entry = createLogEntry(type, message, severity, metadata);
    setEvents((prev) => [entry, ...prev]); // newest first
  }, []);

  // --- Alert management ---
  const addAlert = useCallback((id, message, severity) => {
    setActiveAlerts((prev) => {
      // Don't duplicate
      if (prev.some((a) => a.id === id)) return prev;
      return [...prev, { id, message, severity }];
    });
  }, []);

  const removeAlert = useCallback((id) => {
    setActiveAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  // --- Detection loop ---
  const processFrame = useCallback(() => {
    if (!isRunningRef.current) return;

    const video = videoRef.current;
    if (!video || video.readyState < 2) {
      animFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }

    const now = performance.now();
    // Throttle to ~15 FPS
    if (now - lastFrameTimeRef.current < DETECTION.FRAME_INTERVAL_MS) {
      animFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }
    lastFrameTimeRef.current = now;

    try {
      const result = detectForVideo(video, now);
      const numFaces = result.faceLandmarks ? result.faceLandmarks.length : 0;
      const newFaceStatus = classifyFaceCount(numFaces);

      // --- Face count state changes ---
      if (newFaceStatus !== prevFaceStatusRef.current) {
        setFaceCount(numFaces);
        setFaceStatus(newFaceStatus);

        if (newFaceStatus === FACE_STATUS.NO_FACE) {
          addEvent(EVENT_TYPES.NO_FACE, 'No face detected in frame', SEVERITY.WARNING);
          addAlert('no_face', 'No face detected', SEVERITY.WARNING);
          setSummary((s) => ({ ...s, noFaceIncidents: s.noFaceIncidents + 1 }));
        } else if (newFaceStatus === FACE_STATUS.MULTIPLE_FACES) {
          addEvent(
            EVENT_TYPES.MULTIPLE_FACES,
            `${numFaces} faces detected`,
            SEVERITY.ALERT,
            { count: numFaces }
          );
          addAlert('multiple_faces', `Multiple faces detected (${numFaces})`, SEVERITY.ALERT);
          setSummary((s) => ({ ...s, multipleFaceIncidents: s.multipleFaceIncidents + 1 }));
        } else {
          // ONE_FACE — clear face-related alerts
          if (prevFaceStatusRef.current === FACE_STATUS.NO_FACE) {
            addEvent(EVENT_TYPES.FACE_RETURNED, 'Face returned to frame', SEVERITY.INFO);
          }
          if (prevFaceStatusRef.current === FACE_STATUS.MULTIPLE_FACES) {
            addEvent(EVENT_TYPES.SINGLE_FACE_RESTORED, 'Single face restored', SEVERITY.INFO);
          }
          removeAlert('no_face');
          removeAlert('multiple_faces');
        }
        prevFaceStatusRef.current = newFaceStatus;
      }

      // --- Gaze estimation (only when exactly one face) ---
      let newGazeStatus = GAZE_STATUS.UNKNOWN;
      let headOrientation = null;
      let overlayInfo = null;

      if (numFaces >= 1) {
        // Use the first (primary) face for gaze
        const landmarks = result.faceLandmarks[0];
        headOrientation = estimateHeadOrientation(landmarks);
        const smoothedAway = gazeSmootherRef.current.push(headOrientation.isLookingAway);

        newGazeStatus = smoothedAway ? GAZE_STATUS.LOOKING_AWAY : GAZE_STATUS.LOOKING_AT_SCREEN;

        // Build overlay data for canvas drawing
        const boxes = result.faceLandmarks.map((lms) => getBoundingBoxFromLandmarks(lms));
        overlayInfo = {
          boxes,
          landmarks: result.faceLandmarks[0], // primary face landmarks
          headOrientation,
          isLookingAway: smoothedAway,
          faceCount: numFaces,
        };
      } else {
        gazeSmootherRef.current.reset();
        overlayInfo = { boxes: [], landmarks: null, headOrientation: null, isLookingAway: false, faceCount: 0 };
      }

      setOverlayData(overlayInfo);

      // --- Gaze state changes ---
      if (newGazeStatus !== prevGazeStatusRef.current) {
        setGazeStatus(newGazeStatus);

        if (newGazeStatus === GAZE_STATUS.LOOKING_AWAY) {
          // Start continuous timer
          lookAwayStartRef.current = Date.now();
          lookAwayAlertedRef.current = false;
          addEvent(EVENT_TYPES.LOOKING_AWAY_STARTED, 'User looking away from screen', SEVERITY.WARNING);
        } else if (newGazeStatus === GAZE_STATUS.LOOKING_AT_SCREEN) {
          // Reset timer, log return
          if (prevGazeStatusRef.current === GAZE_STATUS.LOOKING_AWAY) {
            const elapsed = lookAwayStartRef.current
              ? (Date.now() - lookAwayStartRef.current) / 1000
              : 0;
            addEvent(EVENT_TYPES.LOOKING_BACK, `Returned to screen after ${elapsed.toFixed(1)}s`, SEVERITY.INFO);
            removeAlert('looking_away');
          }
          lookAwayStartRef.current = null;
          lookAwayAlertedRef.current = false;
          setLookAwayTimer(0);
        }
        prevGazeStatusRef.current = newGazeStatus;
      }

      // --- Continuous look-away timer ---
      if (newGazeStatus === GAZE_STATUS.LOOKING_AWAY && lookAwayStartRef.current) {
        const elapsed = (Date.now() - lookAwayStartRef.current) / 1000;
        setLookAwayTimer(elapsed);

        // Track longest streak
        if (elapsed > longestLookAwayRef.current) {
          longestLookAwayRef.current = elapsed;
          setSummary((s) => ({ ...s, longestLookAway: elapsed }));
        }

        // Fire alert at 5s threshold (once per streak)
        if (elapsed >= GAZE.AWAY_ALERT_THRESHOLD_S && !lookAwayAlertedRef.current) {
          lookAwayAlertedRef.current = true;
          addEvent(
            EVENT_TYPES.LOOKING_AWAY_ALERT,
            `Look-away exceeded ${GAZE.AWAY_ALERT_THRESHOLD_S}s (${elapsed.toFixed(1)}s)`,
            SEVERITY.ALERT
          );
          addAlert('looking_away', `Looking away for ${elapsed.toFixed(1)}s`, SEVERITY.ALERT);
          setSummary((s) => ({ ...s, lookAwayIncidents: s.lookAwayIncidents + 1 }));
        }
      }

      // --- Determine overall monitoring status ---
      let overallStatus = MONITORING_STATUS.ACTIVE;
      if (newFaceStatus === FACE_STATUS.MULTIPLE_FACES) {
        overallStatus = MONITORING_STATUS.ALERT;
      } else if (newFaceStatus === FACE_STATUS.NO_FACE) {
        overallStatus = MONITORING_STATUS.WARNING;
      } else if (
        newGazeStatus === GAZE_STATUS.LOOKING_AWAY &&
        lookAwayStartRef.current &&
        (Date.now() - lookAwayStartRef.current) / 1000 >= GAZE.AWAY_ALERT_THRESHOLD_S
      ) {
        overallStatus = MONITORING_STATUS.ALERT;
      } else if (newGazeStatus === GAZE_STATUS.LOOKING_AWAY) {
        overallStatus = MONITORING_STATUS.WARNING;
      }
      setMonitoringStatus(overallStatus);
    } catch (err) {
      // Silently handle intermittent detection errors (e.g., video not ready)
      console.warn('Detection frame error:', err);
    }

    animFrameRef.current = requestAnimationFrame(processFrame);
  }, [videoRef, addEvent, addAlert, removeAlert]);

  // --- Start monitoring ---
  const startMonitoring = useCallback(async () => {
    setMonitoringStatus(MONITORING_STATUS.LOADING_MODELS);
    try {
      await initFaceLandmarker();
    } catch (err) {
      console.error('Model init failed:', err);
      addEvent(EVENT_TYPES.MODEL_LOAD_FAILED, `Model loading failed: ${err.message}`, SEVERITY.ERROR);
      setMonitoringStatus(MONITORING_STATUS.ERROR);
      return false;
    }

    // Reset state
    setFaceStatus(FACE_STATUS.NO_FACE);
    setGazeStatus(GAZE_STATUS.UNKNOWN);
    setLookAwayTimer(0);
    setFaceCount(0);
    setEvents([]);
    setActiveAlerts([]);
    setSummary({ multipleFaceIncidents: 0, noFaceIncidents: 0, lookAwayIncidents: 0, longestLookAway: 0 });
    gazeSmootherRef.current.reset();
    lookAwayStartRef.current = null;
    lookAwayAlertedRef.current = false;
    longestLookAwayRef.current = 0;
    prevFaceStatusRef.current = null;
    prevGazeStatusRef.current = null;
    lastFrameTimeRef.current = 0;

    addEvent(EVENT_TYPES.MONITORING_STARTED, 'Monitoring session started', SEVERITY.INFO);
    setMonitoringStatus(MONITORING_STATUS.ACTIVE);

    // Start the detection loop
    isRunningRef.current = true;
    animFrameRef.current = requestAnimationFrame(processFrame);

    return true;
  }, [addEvent, processFrame]);

  // --- Stop monitoring ---
  const stopMonitoring = useCallback(() => {
    isRunningRef.current = false;
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setMonitoringStatus(MONITORING_STATUS.IDLE);
    setGazeStatus(GAZE_STATUS.UNKNOWN);
    setLookAwayTimer(0);
    setOverlayData(null);
    addEvent(EVENT_TYPES.MONITORING_STOPPED, 'Monitoring session stopped', SEVERITY.INFO);
  }, [addEvent]);

  // --- Cleanup on unmount ---
  useEffect(() => {
    return () => {
      isRunningRef.current = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      closeFaceLandmarker();
    };
  }, []);

  return {
    monitoringStatus,
    faceStatus,
    gazeStatus,
    lookAwayTimer,
    faceCount,
    events,
    activeAlerts,
    overlayData,
    summary,
    startMonitoring,
    stopMonitoring,
  };
}
