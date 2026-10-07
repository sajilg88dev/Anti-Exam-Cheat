import { useRef, useEffect, useState } from 'react';
import { CAMERA_STATUS, MONITORING_STATUS, FACE_STATUS, GAZE_STATUS } from '../../utils/constants';
import './WebcamPanel.css';

/**
 * WebcamPanel — renders the live video feed with an optional canvas overlay
 * for face bounding boxes, landmarks, and status badges.
 *
 * The <video> element is ALWAYS rendered (even when camera isn't ready) so that
 * videoRef is valid when useWebcam.startCamera() attaches the stream. The
 * placeholder sits on top as an overlay and hides when the camera is ready.
 */
export default function WebcamPanel({
  videoRef,
  cameraStatus,
  monitoringStatus,
  faceStatus,
  gazeStatus,
  faceCount,
  overlayData,
}) {
  const canvasRef = useRef(null);
  const [showOverlay, setShowOverlay] = useState(true);

  const cameraReady = cameraStatus === CAMERA_STATUS.READY;

  // Draw overlay on canvas when overlayData updates
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || !showOverlay || !overlayData) return;

    const ctx = canvas.getContext('2d');
    // Match canvas to video intrinsic dimensions
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;

    // Draw bounding boxes for each detected face
    if (overlayData.boxes) {
      overlayData.boxes.forEach((box, i) => {
        const color = overlayData.faceCount > 1 ? '#ef4444' : '#10b981';
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.strokeRect(box.x * w, box.y * h, box.width * w, box.height * h);

        // Label
        ctx.fillStyle = color;
        ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
        ctx.fillText(`Subject ${i + 1}`, box.x * w + 4, box.y * h - 6);
      });
    }

    // Draw key landmarks for primary face (small dots)
    if (overlayData.landmarks) {
      ctx.fillStyle = 'rgba(0, 113, 227, 0.65)';
      // Draw a subset of landmarks to keep it subtle (every 3rd)
      for (let i = 0; i < overlayData.landmarks.length; i += 3) {
        const lm = overlayData.landmarks[i];
        ctx.beginPath();
        ctx.arc(lm.x * w, lm.y * h, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw gaze direction indicator
    if (overlayData.headOrientation && overlayData.landmarks) {
      const nose = overlayData.landmarks[1]; // nose tip
      const yaw = overlayData.headOrientation.yaw;
      const pitch = overlayData.headOrientation.pitch;

      // Draw a short line from the nose indicating direction
      const lineLen = 50;
      ctx.strokeStyle = overlayData.isLookingAway ? '#ef4444' : '#10b981';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(nose.x * w, nose.y * h);
      ctx.lineTo(nose.x * w + yaw * lineLen * 3, nose.y * h + pitch * lineLen * 3);
      ctx.stroke();
    }
  }, [overlayData, showOverlay, videoRef]);

  const isActive = monitoringStatus !== MONITORING_STATUS.IDLE && monitoringStatus !== MONITORING_STATUS.LOADING_MODELS;

  // Determine badge
  let badge = null;
  if (isActive && faceStatus === FACE_STATUS.MULTIPLE_FACES) {
    badge = { text: `${faceCount} Faces Detected`, className: 'webcam-panel__badge--alert' };
  } else if (isActive && faceStatus === FACE_STATUS.NO_FACE) {
    badge = { text: 'No Face Detected', className: 'webcam-panel__badge--warning' };
  } else if (isActive && gazeStatus === GAZE_STATUS.LOOKING_AWAY) {
    badge = { text: 'Attention Diverted', className: 'webcam-panel__badge--warning' };
  }

  // Placeholder content for when camera isn't ready
  const placeholderMessage = cameraStatus === CAMERA_STATUS.DENIED
    ? { icon: '🚫', title: 'Camera Access Denied', desc: 'Please grant camera access in browser site settings and refresh the session.' }
    : cameraStatus === CAMERA_STATUS.ERROR
      ? { icon: '⚠️', title: 'Camera Unavailable', desc: 'No video input device was detected or camera stream failed to initialize.' }
      : { icon: '📹', title: 'Camera Feed Inactive', desc: 'Click "Start Monitoring" above to initialize native camera hardware and AI vision.' };

  return (
    <div className="webcam-panel">
      <div className="webcam-panel__video-container">
        {/* Video element is ALWAYS rendered so videoRef is valid for stream attachment */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="webcam-panel__video"
          style={{ display: cameraReady ? 'block' : 'none' }}
        />

        {showOverlay && cameraReady && (
          <canvas ref={canvasRef} className="webcam-panel__canvas" />
        )}

        {/* Placeholder overlay — shown when camera isn't ready */}
        {!cameraReady && (
          <div className="webcam-panel__placeholder">
            <div className="webcam-panel__placeholder-icon">{placeholderMessage.icon}</div>
            <h3>{placeholderMessage.title}</h3>
            <p>{placeholderMessage.desc}</p>
          </div>
        )}

        {badge && (
          <span className={`webcam-panel__badge ${badge.className}`}>
            {badge.text}
          </span>
        )}

        {isActive && cameraReady && (
          <span className="webcam-panel__face-count">
            {faceCount} {faceCount === 1 ? 'face' : 'faces'}
          </span>
        )}
      </div>

      <div className="webcam-panel__toolbar">
        <label>
          <input
            type="checkbox"
            checked={showOverlay}
            onChange={(e) => setShowOverlay(e.target.checked)}
          />
          Debug overlay
        </label>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {monitoringStatus === MONITORING_STATUS.LOADING_MODELS ? 'Loading models…' : ''}
        </span>
      </div>
    </div>
  );
}
