import { SEVERITY, EVENT_TYPES } from './constants';

/**
 * In-memory event logger for the proctoring session.
 * Each entry: { id, timestamp, type, severity, message, metadata? }
 */

let nextId = 1;

/** Create a new log entry object. */
export function createLogEntry(type, message, severity = SEVERITY.INFO, metadata = null) {
  return {
    id: nextId++,
    timestamp: Date.now(),
    type,
    severity,
    message,
    ...(metadata ? { metadata } : {}),
  };
}

/** Human-readable label for an event type */
const EVENT_LABELS = {
  [EVENT_TYPES.MONITORING_STARTED]: 'Monitoring Started',
  [EVENT_TYPES.MONITORING_STOPPED]: 'Monitoring Stopped',
  [EVENT_TYPES.NO_FACE]: 'No Face Detected',
  [EVENT_TYPES.FACE_RETURNED]: 'Face Returned',
  [EVENT_TYPES.MULTIPLE_FACES]: 'Multiple Faces Detected',
  [EVENT_TYPES.SINGLE_FACE_RESTORED]: 'Single Face Restored',
  [EVENT_TYPES.LOOKING_AWAY_STARTED]: 'Looking Away',
  [EVENT_TYPES.LOOKING_AWAY_ALERT]: 'Look-Away Exceeded 5s',
  [EVENT_TYPES.LOOKING_BACK]: 'Looking Back at Screen',
  [EVENT_TYPES.CAMERA_DENIED]: 'Camera Permission Denied',
  [EVENT_TYPES.CAMERA_ERROR]: 'Camera Error',
  [EVENT_TYPES.MODEL_LOAD_FAILED]: 'Model Load Failed',
};

export function getEventLabel(type) {
  return EVENT_LABELS[type] || type;
}

/** Format a timestamp to HH:MM:SS */
export function formatTimestamp(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString('en-US', { hour12: false });
}

/** Reset the ID counter (useful if sessions restart) */
export function resetLogger() {
  nextId = 1;
}
