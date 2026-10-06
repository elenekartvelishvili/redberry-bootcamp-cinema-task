import './SeatMap.css';

const LEGEND = [
  { state: 'available', label: 'Available' },
  { state: 'selected', label: 'Selected' },
  { state: 'sold', label: 'Sold' },
  { state: 'held', label: 'Held by another user' },
  { state: 'unavailable', label: 'Unavailable' },
];

function SeatMap({ sections }) {
  return (
    <div className="seat-map">
      <div className="seat-map__screen text-label-s">Screen</div>

      {sections.map((section) => {
        const firstRow = section.rows[0].label;
        const lastRow = section.rows[section.rows.length - 1].label;

        return (
          <div key={section.name} className="seat-map__section">
            <p className="seat-map__section-name text-label-s">
              {section.name} · Rows {firstRow}-{lastRow}
            </p>

            {section.rows.map((row) => (
              <div key={row.label} className="seat-map__row">
                <span className="seat-map__row-label text-label-s">{row.label}</span>

                {row.seats.map((seat) => (
                  <button
                    key={seat.id}
                    type="button"
                    className={`seat seat--${seat.state} ${seat.aisleAfter ? 'seat--aisle' : ''}`}
                    disabled={seat.state !== 'available'}
                  >
                    {seat.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        );
      })}

      <div className="seat-map__legend">
        {LEGEND.map((item) => (
          <span key={item.state} className="seat-map__legend-item text-label-s">
            <span className={`seat seat--${item.state}`} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default SeatMap;