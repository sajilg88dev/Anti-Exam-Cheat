import { formatTimestamp, getEventLabel } from '../../utils/eventLogger';
import './EventLog.css';

export default function EventLog({ events }) {
  return (
    <div className="event-log">
      <h3 className="event-log__title">Forensic Audit Log</h3>
      {events.length === 0 ? (
        <div className="event-log__empty">No events recorded yet</div>
      ) : (
        <div className="event-log__list">
          {events.map((event) => (
            <div key={event.id} className="event-log__item">
              <span className={`event-log__dot event-log__dot--${event.severity}`} />
              <span className="event-log__time">{formatTimestamp(event.timestamp)}</span>
              <span className="event-log__message">{event.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
