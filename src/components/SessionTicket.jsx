import seatGray from '../assets/icons/seat-gray.svg';
import './SessionTicket.css';

function SessionTicket({ session, disabled, onSelect }) {
  return (
    <button
      type="button"
      className="ticket"
      disabled={disabled || session.isSoldOut}
      onClick={() => onSelect(session)}
    >
      <span className="ticket__left">
        <span className="ticket__time">{session.time}</span>
        <span className="ticket__meta">
          <span className="ticket__lang">{session.language.code}</span>
          <span className="ticket__format">{session.format.name}</span>
        </span>
      </span>

      <span className="ticket__right">
        <span className="ticket__price">₾ {session.price}</span>
        <span className="ticket__seats">
          {session.isSoldOut ? (
            'Sold out'
          ) : (
            <>
              <img src={seatGray} alt="" width="12" height="12" />
              {session.seatsLeft} left
            </>
          )}
        </span>
      </span>
    </button>
  );
}

export default SessionTicket;