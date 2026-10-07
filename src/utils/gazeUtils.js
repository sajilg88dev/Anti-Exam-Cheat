import { GAZE } from './constants';

/**
 * Estimate head yaw and pitch from MediaPipe FaceLandmarker's 478 landmarks.
 *
 * Approach: We use key facial landmarks to approximate head orientation.
 *
 * Key landmark indices (MediaPipe canonical face mesh):
 *   1   — nose tip
 *   33  — right eye outer corner (from subject's perspective, left in mirrored view)
 *   263 — left eye outer corner
 *   10  — forehead / top of face midline
 *   152 — chin bottom
 *   234 — right face edge
 *   454 — left face edge
 *
 * Yaw estimation:
 *   Compare the nose tip's horizontal position relative to the midpoint of the
 *   two face-edge landmarks. If the nose is significantly off-center, the head
 *   is rotated horizontally.
 *
 * Pitch estimation:
 *   Compare the nose tip's vertical position relative to the midpoint between
 *   forehead and chin. A high ratio means looking down; low means looking up.
 *
 * Returns { yaw, pitch, isLookingAway }
 *   yaw/pitch: signed normalized deviation (−1 to 1 range, roughly)
 *   isLookingAway: boolean based on threshold comparison
 */

// Landmark indices
const NOSE_TIP = 1;
const RIGHT_FACE_EDGE = 234;
const LEFT_FACE_EDGE = 454;
const FOREHEAD = 10;
const CHIN = 152;
const RIGHT_EYE_OUTER = 33;
const LEFT_EYE_OUTER = 263;

export function estimateHeadOrientation(landmarks) {
  const nose = landmarks[NOSE_TIP];
  const rightEdge = landmarks[RIGHT_FACE_EDGE];
  const leftEdge = landmarks[LEFT_FACE_EDGE];
  const forehead = landmarks[FOREHEAD];
  const chin = landmarks[CHIN];

  // --- Yaw ---
  // Horizontal midpoint of face edges
  const faceCenterX = (rightEdge.x + leftEdge.x) / 2;
  const faceWidth = Math.abs(leftEdge.x - rightEdge.x);
  // Nose deviation from face center, normalized by face width
  const yaw = faceWidth > 0.001 ? (nose.x - faceCenterX) / faceWidth : 0;

  // --- Pitch ---
  // Vertical midpoint between forehead and chin
  const faceCenterY = (forehead.y + chin.y) / 2;
  const faceHeight = Math.abs(chin.y - forehead.y);
  // Nose deviation from vertical center, normalized by face height
  const pitch = faceHeight > 0.001 ? (nose.y - faceCenterY) / faceHeight : 0;

  const isLookingAway =
    Math.abs(yaw) > GAZE.YAW_THRESHOLD || Math.abs(pitch) > GAZE.PITCH_THRESHOLD;

  return { yaw, pitch, isLookingAway };
}

/**
 * Smoothing buffer for gaze state.
 * Maintains a rolling window of boolean values (isLookingAway per frame).
 * Returns the majority vote over the window to prevent single-frame flicker.
 */
export class GazeSmoother {
  constructor(windowSize = GAZE.SMOOTHING_WINDOW) {
    this.windowSize = windowSize;
    this.buffer = [];
  }

  /** Push a new frame result and return the smoothed value */
  push(isLookingAway) {
    this.buffer.push(isLookingAway);
    if (this.buffer.length > this.windowSize) {
      this.buffer.shift();
    }
    // Majority vote: if more than half the window says "away", classify as away
    const awayCount = this.buffer.filter(Boolean).length;
    return awayCount > this.windowSize / 2;
  }

  reset() {
    this.buffer = [];
  }
}
