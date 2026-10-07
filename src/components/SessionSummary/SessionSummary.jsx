import { MONITORING_STATUS } from '../../utils/constants';
import { formatSeconds } from '../../utils/timerUtils';
import './SessionSummary.css';

export default function SessionSummary({
  monitoringStatus,
  elapsedFormatted,
  faceCount,
  summary,
}) {
  const isActive = monitoringStatus !== MONITORING_STATUS.IDLE;

  return (
    <div className="session-summary">
      <h3 className="session-summary__title">Session Summary</h3>
      <div className="summary-grid">
        <div className="summary-card">
          <span className="summary-card__label">Duration</span>
          <span className="summary-card__value">{elapsedFormatted}</span>
        </div>
        <div className="summary-card">
          <span className="summary-card__label">Monitoring</span>
          <span className="summary-card__value">
            {isActive ? '● Active' : '○ Idle'}
          </span>
        </div>
        <div className="summary-card">
          <span className="summary-card__label">Multi-Face Violations</span>
          <span
            className={`summary-card__value ${
              summary.multipleFaceIncidents > 0 ? 'summary-card__value--danger' : ''
            }`}
          >
            {summary.multipleFaceIncidents}
          </span>
        </div>
        <div className="summary-card">
          <span className="summary-card__label">Look-Away Violations</span>
          <span
            className={`summary-card__value ${
              summary.lookAwayIncidents > 0 ? 'summary-card__value--danger' : ''
            }`}
          >
            {summary.lookAwayIncidents}
          </span>
        </div>
        <div className="summary-card">
          <span className="summary-card__label">Longest Look-Away</span>
          <span
            className={`summary-card__value ${
              summary.longestLookAway >= 5 ? 'summary-card__value--warning' : ''
            }`}
          >
            {formatSeconds(summary.longestLookAway)}
          </span>
        </div>
        <div className="summary-card">
          <span className="summary-card__label">Current Faces</span>
          <span className="summary-card__value">{faceCount}</span>
        </div>
        <div className="summary-card">
          <span className="summary-card__label">No-Face Incidents</span>
          <span
            className={`summary-card__value ${
              summary.noFaceIncidents > 0 ? 'summary-card__value--warning' : ''
            }`}
          >
            {summary.noFaceIncidents}
          </span>
        </div>
      </div>
    </div>
  );
}
