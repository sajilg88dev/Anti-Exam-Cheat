import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision';
import { MEDIAPIPE } from '../../utils/constants';

/**
 * Singleton-style service for MediaPipe FaceLandmarker.
 *
 * FaceLandmarker gives us both:
 *   - Face detection (count of faces, bounding info)
 *   - 478 facial landmarks per face (for head pose / gaze approximation)
 *
 * This avoids needing a separate FaceDetector model.
 */

let faceLandmarker = null;
let isInitializing = false;

/**
 * Initialize the FaceLandmarker model.
 * Returns the FaceLandmarker instance. Throws on failure.
 */
export async function initFaceLandmarker() {
  if (faceLandmarker) return faceLandmarker;
  if (isInitializing) {
    // Wait for existing init to finish
    return new Promise((resolve, reject) => {
      const check = setInterval(() => {
        if (faceLandmarker) {
          clearInterval(check);
          resolve(faceLandmarker);
        }
        if (!isInitializing && !faceLandmarker) {
          clearInterval(check);
          reject(new Error('FaceLandmarker initialization failed'));
        }
      }, 100);
    });
  }

  isInitializing = true;
  try {
    const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE.WASM_PATH);

    faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: MEDIAPIPE.MODEL_URL,
        delegate: 'GPU', // Use WebGL for acceleration; falls back to CPU
      },
      runningMode: 'VIDEO',
      numFaces: MEDIAPIPE.MAX_FACES,
      minFaceDetectionConfidence: MEDIAPIPE.MIN_DETECTION_CONFIDENCE,
      minTrackingConfidence: MEDIAPIPE.MIN_TRACKING_CONFIDENCE,
      outputFaceBlendshapes: false, // Not needed for this POC
      outputFacialTransformationMatrixes: false,
    });

    isInitializing = false;
    return faceLandmarker;
  } catch (err) {
    isInitializing = false;
    faceLandmarker = null;
    throw err;
  }
}

/**
 * Run detection on a video frame.
 * Returns the FaceLandmarkerResult: { faceLandmarks, faceBlendshapes, ... }
 */
export function detectForVideo(videoElement, timestampMs) {
  if (!faceLandmarker) {
    throw new Error('FaceLandmarker not initialized. Call initFaceLandmarker() first.');
  }
  return faceLandmarker.detectForVideo(videoElement, timestampMs);
}

/**
 * Close the model and free resources.
 */
export function closeFaceLandmarker() {
  if (faceLandmarker) {
    faceLandmarker.close();
    faceLandmarker = null;
  }
}
