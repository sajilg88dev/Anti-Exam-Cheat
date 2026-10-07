import { SEVERITY } from '../../utils/constants';
import './AlertPanel.css';

export default function AlertPanel({ activeAlerts }) {
  return (
    <div className="alert-panel">
      <h3 className="alert-panel__title">Active Alerts</h3>
      {activeAlerts.length === 0 ? (
        <div className="alert-panel__empty">No active alerts</div>
      ) : (
        activeAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`alert-item ${
              alert.severity === SEVERITY.ALERT ? 'alert-item--alert' : 'alert-item--warning'
            }`}
          >
            <span className="alert-item__icon">
              {alert.severity === SEVERITY.ALERT ? '🔴' : '🟡'}
            </span>
            {alert.message}
          </div>
        ))
      )}
    </div>
  );
}
