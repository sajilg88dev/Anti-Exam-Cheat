import {
  CAMERA_STATUS,
  FACE_STATUS,
  GAZE_STATUS,
  MONITORING_STATUS,
} from '../../utils/constants';
import { formatSeconds } from '../../utils/timerUtils';
import './StatusPanel.css';

const FACE_LABELS = {
  [FACE_STATUS.NO_FACE]: 'No Face',
  [FACE_STATUS.ONE_FACE]: 'One Face',
  [FACE_STATUS.MULTIPLE_FACES]: 'Multiple Faces',
};

const GAZE_LABELS = {
  [GAZE_STATUS.LOOKING_AT_SCREEN]: 'Looking at Screen',
  [GAZE_STATUS.LOOKING_AWAY]: 'Looking Away',
  [GAZE_STATUS.UNKNOWN]: 'Unknown',
};

const MONITORING_LABELS = {
  [MONITORING_STATUS.IDLE]: 'Idle',
  [MONITORING_STATUS.LOADING_MODELS]: 'Loading Models…',
  [MONITORING_STATUS.ACTIVE]: 'Active',
  [MONITORING_STATUS.WARNING]: 'Warning',
  [MONITORING_STATUS.ALERT]: 'Alert',
  [MONITORING_STATUS.ERROR]: 'Error',
};

function getDotClass(status) {
  switch (status) {
    case 'ok': return 'status-dot--ok';
    case 'warning': return 'status-dot--warning';
    case 'alert': return 'status-dot--alert';
    default: return 'status-dot--neutral';
  }
}

function getTextClass(status) {
  switch (status) {
    case 'ok': return 'status-text--ok';
    case 'warning': return 'status-text--warning';
    case 'alert': return 'status-text--alert';
    default: return 'status-text--neutral';
  }
}

function cameraLevel(s) {
  if (s === CAMERA_STATUS.READY) return 'ok';
  if (s === CAMERA_STATUS.DENIED || s === CAMERA_STATUS.ERROR) return 'alert';
  return 'neutral';
}

function faceLevel(s) {
  if (s === FACE_STATUS.ONE_FACE) return 'ok';
  if (s === FACE_STATUS.MULTIPLE_FACES) return 'alert';
  if (s === FACE_STATUS.NO_FACE) return 'warning';
  return 'neutral';
}

function gazeLevel(s) {
  if (s === GAZE_STATUS.LOOKING_AT_SCREEN) return 'ok';
  if (s === GAZE_STATUS.LOOKING_AWAY) return 'warning';
  return 'neutral';
}

function monitoringLevel(s) {
  if (s === MONITORING_STATUS.ACTIVE) return 'ok';
  if (s === MONITORING_STATUS.WARNING) return 'warning';
  if (s === MONITORING_STATUS.ALERT) return 'alert';
  if (s === MONITORING_STATUS.ERROR) return 'alert';
  return 'neutral';
}

function StatusRow({ label, value, level }) {
  return (
    <div className="status-row">
      <span className="status-row__label">{label}</span>
      <span className={`status-row__value ${getTextClass(level)}`}>
        <span className={`status-dot ${getDotClass(level)}`} />
        {value}
      </span>
    </div>
  );
}

export default function StatusPanel({
  cameraStatus,
  faceStatus,
  gazeStatus,
  monitoringStatus,
  lookAwayTimer,
}) {
  const cameraLabel =
    cameraStatus === CAMERA_STATUS.READY
      ? 'Ready'
      : cameraStatus === CAMERA_STATUS.DENIED
        ? 'Denied'
        : cameraStatus === CAMERA_STATUS.ERROR
          ? 'Error'
          : cameraStatus === CAMERA_STATUS.REQUESTING
            ? 'Requesting…'
            : 'Idle';

  const modelsLabel =
    monitoringStatus === MONITORING_STATUS.LOADING_MODELS
      ? 'Loading…'
      : monitoringStatus === MONITORING_STATUS.IDLE
        ? 'Not loaded'
        : 'Ready';
  const modelsLevel =
    monitoringStatus === MONITORING_STATUS.LOADING_MODELS
      ? 'warning'
      : monitoringStatus !== MONITORING_STATUS.IDLE
        ? 'ok'
        : 'neutral';

  return (
    <div className="status-panel">
      <h3 className="status-panel__title">System Telemetry</h3>
      <StatusRow label="Camera" value={cameraLabel} level={cameraLevel(cameraStatus)} />
      <StatusRow label="Models" value={modelsLabel} level={modelsLevel} />
      <StatusRow label="Faces" value={FACE_LABELS[faceStatus] || '—'} level={faceLevel(faceStatus)} />
      <StatusRow label="Attention" value={GAZE_LABELS[gazeStatus] || '—'} level={gazeLevel(gazeStatus)} />
      <StatusRow
        label="Look-Away Timer"
        value={lookAwayTimer > 0 ? formatSeconds(lookAwayTimer) : '0.0s'}
        level={lookAwayTimer >= 5 ? 'alert' : lookAwayTimer > 0 ? 'warning' : 'neutral'}
      />
      <StatusRow
        label="Status"
        value={MONITORING_LABELS[monitoringStatus] || '—'}
        level={monitoringLevel(monitoringStatus)}
      />
    </div>
  );
}
