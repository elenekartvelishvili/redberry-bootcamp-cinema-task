import './BookingSummary.css';

const roundPrice = (value) => Math.round(value * 100) / 100;

function BookingSummary({ selected, ticketTypes, price, movie, tooYoung, maxSeats, onTypeChange, onNext }) {
  const findType = (id) => ticketTypes.find((type) => type.id === id);

  let subtotal = 0;
  const problems = [];

  selected.forEach((item) => {
    const type = findType(item.ticketTypeId);
    subtotal += price * type.priceRatio;

    if (type.blockedFromRatingAge !== null && movie.ageRating.minAge >= type.blockedFromRatingAge) {
      problems.push(`${item.code}: ${type.name} tickets are not available for ${movie.ageRating.code} titles.`);
    }
  });

  if (tooYoung) {
    problems.push(`This film is rated ${movie.ageRating.code}. You cannot buy tickets for it with this account.`);
  }

  const canContinue = selected.length > 0 && problems.length === 0;

  return (
    <aside className="summary">
      <h3 className="text-label-m">Your seats · Max {maxSeats}</h3>

      {selected.length === 0 ? (
        <p className="summary__hint text-body-s">
          Pick up to {maxSeats} seats from the map. Each seat can carry its own ticket type.
        </p>
      ) : (
        <ul className="summary__list">
          {selected.map((item) => {
            const type = findType(item.ticketTypeId);

            return (
              <li key={item.id} className="summary__line">
                <span className="text-label-m">{item.code}</span>
                <select
                  className="summary__select text-label-s"
                  value={item.ticketTypeId}
                  onChange={(e) => onTypeChange(item.id, Number(e.target.value))}
                >
                  {ticketTypes.map((ticketType) => (
                    <option key={ticketType.id} value={ticketType.id}>
                      {ticketType.name}
                    </option>
                  ))}
                </select>
                <span className="text-label-m">₾{roundPrice(price * type.priceRatio)}</span>
              </li>
            );
          })}
        </ul>
      )}

      {problems.map((problem) => (
        <p key={problem} className="summary__problem text-label-s">
          {problem}
        </p>
      ))}

      <div className="summary__total">
        <span className="text-label-s">SUBTOTAL</span>
        <span className="text-h2">₾{roundPrice(subtotal)}</span>
      </div>

      <button
        type="button"
        className="btn btn--red btn--full text-button"
        disabled={!canContinue}
        onClick={onNext}
      >
        Next: Checkout
      </button>
    </aside>
  );
}

export default BookingSummary;