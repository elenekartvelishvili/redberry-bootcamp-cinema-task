import './TicketCard.css';

const TWO_HOURS = 2 * 60 * 60 * 1000;

const formatShortDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

const formatRefundDeadline = (startsAt) => {
  const deadline = new Date(new Date(startsAt).getTime() - TWO_HOURS);
  const time = deadline.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return `${time}, ${formatShortDate(deadline)}`;
};

function TicketCard({ order, onRefund }) {
  const { session } = order;
  const isRefunded = order.status === 'refunded';

  return (
    <article className="ticket-card">
      <div className="ticket-card__main">
        <img src={session.movie.posterUrl} alt={session.movie.title} className="ticket-card__poster" />

        <div className="ticket-card__info">
          <div className="ticket-card__title-row">
            <h3 className="text-h3">{session.movie.title}</h3>
            <span className="badge badge--red badge--small text-label-s">
              {session.movie.ageRating.code}
            </span>
            <span className="ticket-card__muted text-body-s">{session.movie.runtimeMinutes} min</span>
            {isRefunded && <span className="badge badge--small text-label-s">Refunded</span>}
          </div>

          <div className="ticket-card__details">
            <div>
              <span className="ticket-card__label text-label-s">Date</span>
              <span className="text-label-m">
                {formatShortDate(session.date)} · {session.time}
              </span>
            </div>
            <div>
              <span className="ticket-card__label text-label-s">Venue</span>
              <span className="text-label-m">
                {session.venue.name} · Hall {session.hall.name}
              </span>
            </div>
            <div>
              <span className="ticket-card__label text-label-s">Format</span>
              <span className="text-label-m">
                {session.format.name} · {session.language.name}
              </span>
            </div>
          </div>

          <div className="ticket-card__seats">
            <span className="ticket-card__label text-label-s">Seats</span>
            {order.tickets.map((ticket) => (
              <span key={ticket.id} className="ticket-card__seat text-label-s">
                {ticket.seatCode} · {ticket.ticketType.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="ticket-card__side">
        <span className="ticket-card__label text-label-s">Order</span>
        <span className="text-label-m">#{order.reference}</span>

        <div className="ticket-card__total">
          <span className="text-body-s">Total paid</span>
          <span className="text-h2">₾{order.totalPrice}</span>
        </div>

        {onRefund && (
          <>
            <button
              type="button"
              className="btn btn--ghost btn--full text-button"
              disabled={!order.isRefundable}
              onClick={() => onRefund(order)}
            >
              Refund
            </button>
            <span className="ticket-card__muted text-body-s">
              {order.isRefundable
                ? `Refundable until ${formatRefundDeadline(session.startsAt)}`
                : 'Refunds close 2 hours before the session starts'}
            </span>
          </>
        )}
      </div>
    </article>
  );
}

export default TicketCard;