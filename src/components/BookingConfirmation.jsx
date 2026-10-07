function BookingConfirmation({ order, onMyTickets, onClose }) {
  const { session } = order;

  return (
    <div className="confirmation">
      <h3 className="text-h2">Booking confirmed!</h3>
      <p className="text-body-m">
        Order reference: <strong>{order.reference}</strong>
      </p>
      <p className="confirmation__details text-body-m">
        {session.movie.title} · {session.venue.name} · Hall {session.hall.name} · {session.date} ·{' '}
        {session.time}
      </p>

      <ul className="summary__list">
        {order.tickets.map((ticket) => (
          <li key={ticket.id} className="summary__line">
            <span className="text-label-m">{ticket.seatCode}</span>
            <span className="text-body-s">{ticket.ticketType.name}</span>
            <span className="text-label-m">₾{ticket.price}</span>
          </li>
        ))}
      </ul>

      <p className="text-label-m">
        Total paid: ₾{order.totalPrice} · Card ending in {order.cardLastFour}
      </p>

      <div className="confirmation__actions">
        <button type="button" className="btn btn--red text-button" onClick={onMyTickets}>
          My Tickets
        </button>
        <button type="button" className="btn btn--ghost text-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default BookingConfirmation;