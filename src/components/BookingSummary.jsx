import './BookingSummary.css';

const roundPrice = (value) => Math.round(value * 100) / 100;

function BookingSummary({
  selected,
  ticketTypes,
  price,
  movie,
  tooYoung,
  maxSeats,
  holding,
  onTypeChange,
  onNext,
}) {
  const allowedTypes = ticketTypes.filter(
    (type) => type.blockedFromRatingAge === null || movie.ageRating.minAge < type.blockedFromRatingAge
  );

  const findType = (slug) => ticketTypes.find((type) => type.slug === slug);

  let subtotal = 0;
  selected.forEach((item) => {
    subtotal += price * findType(item.ticketType).priceRatio;
  });

  const canContinue = selected.length > 0 && !tooYoung && !holding;

  return (
    <aside className="summary">
      <h3 className="text-label-m">Your seats · Max {maxSeats}</h3>

      {selected.length === 0 ? (
        <p className="summary__hint text-body-s">
          Pick up to {maxSeats} seats from the map. Each seat can carry its own ticket type.
        </p>
      ) : (
        <ul className="summary__list">
          {selected.map((item) => (
            <li key={item.id} className="summary__line">
              <span className="text-label-m">{item.code}</span>
              <select
                className="summary__select text-label-s"
                value={item.ticketType}
                onChange={(e) => onTypeChange(item.id, e.target.value)}
              >
                {allowedTypes.map((type) => (
                  <option key={type.slug} value={type.slug}>
                    {type.name}
                  </option>
                ))}
              </select>
              <span className="text-label-m">
                ₾{roundPrice(price * findType(item.ticketType).priceRatio)}
              </span>
            </li>
          ))}
        </ul>
      )}

      {tooYoung && (
        <p className="summary__problem text-label-s">
          This film is rated {movie.ageRating.code}. You cannot buy tickets for it with this account.
        </p>
      )}

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
        {holding ? 'Holding seats...' : 'Next: Checkout'}
      </button>
    </aside>
  );
}

export default BookingSummary;