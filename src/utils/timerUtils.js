/**
 * Timer utilities for the continuous look-away timer.
 */

/**
 * Format seconds to one decimal place for display (e.g. "3.2s").
 */
export function formatSeconds(seconds) {
  return `${seconds.toFixed(1)}s`;
}

/**
 * Format a duration in ms to MM:SS for session duration display.
 */
export function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
