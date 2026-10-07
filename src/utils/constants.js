/**
 * Central configuration for detection thresholds, timing, and UI constants.
 * Tune these values to adjust sensitivity across different environments.
 */

// --- MediaPipe Model ---
export const MEDIAPIPE = {
  // CDN path for MediaPipe WASM runtime files
  WASM_PATH: 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm',
  // Model asset for FaceLandmarker
  MODEL_URL:
    'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
  // Maximum faces to detect per frame
  MAX_FACES: 4,
  // Minimum detection confidence
  MIN_DETECTION_CONFIDENCE: 0.5,
  MIN_TRACKING_CONFIDENCE: 0.5,
};

// --- Detection Loop ---
export const DETECTION = {
  // Target interval between frames in ms (~15 FPS for balance of accuracy vs perf)
  FRAME_INTERVAL_MS: 66,
};

// --- Face Status ---
export const FACE_STATUS = {
  NO_FACE: 'no_face',
  ONE_FACE: 'one_face',
  MULTIPLE_FACES: 'multiple_faces',
};

// --- Gaze / Attention ---
export const GAZE = {
  // Head orientation thresholds (normalized units, not degrees).
  // These are ratios derived from landmark geometry — not raw angles.
  YAW_THRESHOLD: 0.28, // horizontal: how far left/right before "looking away"
  PITCH_THRESHOLD: 0.22, // vertical: how far up/down before "looking away"

  // Number of consecutive frames that must agree before switching gaze state.
  // Prevents flicker on noisy single frames.
  SMOOTHING_WINDOW: 5,

  // Continuous look-away duration (seconds) before triggering alert
  AWAY_ALERT_THRESHOLD_S: 5,
};

export const GAZE_STATUS = {
  LOOKING_AT_SCREEN: 'looking_at_screen',
  LOOKING_AWAY: 'looking_away',
  UNKNOWN: 'unknown',
};

// --- Camera ---
export const CAMERA_STATUS = {
  IDLE: 'idle',
  REQUESTING: 'requesting',
  READY: 'ready',
  DENIED: 'denied',
  ERROR: 'error',
};

// --- Monitoring ---
export const MONITORING_STATUS = {
  IDLE: 'idle',
  LOADING_MODELS: 'loading_models',
  ACTIVE: 'active',
  WARNING: 'warning',
  ALERT: 'alert',
  ERROR: 'error',
};

// --- Event Types ---
export const EVENT_TYPES = {
  MONITORING_STARTED: 'monitoring_started',
  MONITORING_STOPPED: 'monitoring_stopped',
  NO_FACE: 'no_face',
  FACE_RETURNED: 'face_returned',
  MULTIPLE_FACES: 'multiple_faces',
  SINGLE_FACE_RESTORED: 'single_face_restored',
  LOOKING_AWAY_STARTED: 'looking_away_started',
  LOOKING_AWAY_ALERT: 'looking_away_alert',
  LOOKING_BACK: 'looking_back',
  CAMERA_DENIED: 'camera_denied',
  CAMERA_ERROR: 'camera_error',
  MODEL_LOAD_FAILED: 'model_load_failed',
};

// Severity levels for log entries
export const SEVERITY = {
  INFO: 'info',
  WARNING: 'warning',
  ALERT: 'alert',
  ERROR: 'error',
};
