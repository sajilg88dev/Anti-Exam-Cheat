import { useState, useRef, useCallback } from 'react';
import { CAMERA_STATUS } from '../utils/constants';

/**
 * Hook to manage webcam access and the video stream.
 * Handles permission requesting, stream lifecycle, and cleanup.
 */
export function useWebcam() {
  const [cameraStatus, setCameraStatus] = useState(CAMERA_STATUS.IDLE);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = useCallback(async () => {
    setCameraStatus(CAMERA_STATUS.REQUESTING);

    // Check for browser support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraStatus(CAMERA_STATUS.ERROR);
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video metadata to load
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => {
            resolve();
          };
        });

        // Explicitly play the video to avoid black screen issues
        // (Autoplay sometimes fails when elements are dynamically styled)
        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.warn('Video play() failed, falling back to autoplay attribute:', playErr);
        }
      }

      setCameraStatus(CAMERA_STATUS.READY);
      return true;
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraStatus(CAMERA_STATUS.DENIED);
      } else {
        setCameraStatus(CAMERA_STATUS.ERROR);
      }
      return false;
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
    setCameraStatus(CAMERA_STATUS.IDLE);
  }, []);

  return {
    videoRef,
    cameraStatus,
    startCamera,
    stopCamera,
  };
}
