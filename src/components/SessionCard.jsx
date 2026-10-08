import seatGreen from '../assets/icons/seat-green.svg';
import seatRed from '../assets/icons/seat-red.svg';
import './SessionCard.css';

const FEW_SEATS = 5;

function SessionCard({ session, onSelect }) {
  const fewLeft = session.seatsLeft <= FEW_SEATS;

  return (
    <button
      type="button"
      className="session-card"
      disabled={session.isSoldOut}
      onClick={() => onSelect(session)}
    >
      <div className="session-card__top">
        <span className="text-h3">{session.time}</span>
        <span className="session-card__format text-label-s">{session.format.name}</span>
      </div>

      <div className="session-card__bottom">
        <div className="session-card__where">
          <span className="session-card__lang text-body-s">{session.language.name}</span>
          <span className="text-label-s">
            {session.venue.name} · Hall {session.hall.name}
          </span>
        </div>

        <div className="session-card__right">
          {session.isSoldOut ? (
            <span className="session-card__sold text-body-s">Sold out</span>
          ) : (
            <span className={`session-card__seats text-body-s ${fewLeft ? 'session-card__seats--few' : ''}`}>
              <img src={fewLeft ? seatRed : seatGreen} alt="" width="12" height="12" />
              {session.seatsLeft} left
            </span>
          )}
          <span className="text-button">from ₾{session.price}</span>
        </div>
      </div>
    </button>
  );
}

export default SessionCard;