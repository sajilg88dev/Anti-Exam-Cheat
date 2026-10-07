import { FACE_STATUS } from './constants';

/**
 * Determine face status from the number of detected faces.
 */
export function classifyFaceCount(count) {
  if (count === 0) return FACE_STATUS.NO_FACE;
  if (count === 1) return FACE_STATUS.ONE_FACE;
  return FACE_STATUS.MULTIPLE_FACES;
}

/**
 * Extract a simple bounding box from face landmarks for overlay drawing.
 * landmarks: array of {x, y, z} in normalized [0,1] coords.
 * Returns { x, y, width, height } in normalized coords.
 */
export function getBoundingBoxFromLandmarks(landmarks) {
  let minX = 1, minY = 1, maxX = 0, maxY = 0;
  for (const lm of landmarks) {
    if (lm.x < minX) minX = lm.x;
    if (lm.y < minY) minY = lm.y;
    if (lm.x > maxX) maxX = lm.x;
    if (lm.y > maxY) maxY = lm.y;
  }
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}
