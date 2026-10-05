import { toDateKey, getNextDays } from '../utils/format';
import checkedIcon from '../assets/icons/checkbox-checked.svg';
import './FilterSidebar.css';

const splitLabel = (label) => {
  const [name, rest] = label.split(' (');
  return [name, rest ? rest.replace(')', '') : ''];
};

function CheckRow({ label, hint, checked, onToggle }) {
  return (
    <label className="check-row">
      <input type="checkbox" checked={checked} onChange={onToggle} />
      <span className={`check-row__box ${checked ? 'check-row__box--checked' : ''}`}>
        {checked && <img src={checkedIcon} alt="" />}
      </span>
      <span className="check-row__text">
        <span className="text-label-m">{label}</span>
        {hint && <span className="check-row__hint text-body-s">· {hint}</span>}
      </span>
    </label>
  );
}

function FilterSidebar({ options, venues, formats, languages, times, date, onChange }) {
  if (!options) {
    return <div className="filters text-body-s">Loading filters...</div>;
  }

  const toggleInList = (list, slug) =>
    list.includes(slug) ? list.filter((item) => item !== slug) : [...list, slug];

  const formatsForVenues = (venueSlugs) => {
    if (venueSlugs.length === 0) return options.formats;
    const chosenVenues = options.venues.filter((venue) => venueSlugs.includes(venue.slug));
    return options.formats.filter((format) =>
      chosenVenues.some((venue) => venue.formats.some((f) => f.slug === format.slug))
    );
  };

  const handleVenue = (slug) => {
    const nextVenues = toggleInList(venues, slug);
    const allowed = formatsForVenues(nextVenues).map((format) => format.slug);
    onChange({
      venues: nextVenues,
      formats: formats.filter((format) => allowed.includes(format)),
    });
  };

  const visibleFormats = formatsForVenues(venues);
  const activeCount = venues.length + formats.length + languages.length + times.length;

  const clearAll = () => onChange({ venues: [], formats: [], languages: [], times: [] });

  return (
    <div className="filters">
      <h2 className="text-h3">Filters</h2>

      <div className="filters__group">
        <h3 className="filters__title">Venue</h3>
        {options.venues.map((venue) => (
          <CheckRow
            key={venue.slug}
            label={venue.name}
            hint={venue.city}
            checked={venues.includes(venue.slug)}
            onToggle={() => handleVenue(venue.slug)}
          />
        ))}
      </div>

      <div className="filters__divider" />

      <div className="filters__group">
        <h3 className="filters__title">Date</h3>
        <div className="filters__days">
          {getNextDays().map((day) => {
            const key = toDateKey(day);
            return (
              <button
                key={key}
                type="button"
                className={`day-btn ${key === date ? 'day-btn--active' : ''}`}
                onClick={() => onChange({ date: key })}
              >
                <span>{day.toLocaleDateString('en-GB', { weekday: 'short' })}</span>
                <span>{day.getDate()}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="filters__divider" />

      <div className="filters__group">
        <h3 className="filters__title">Format</h3>
        {visibleFormats.map((format) => (
          <CheckRow
            key={format.slug}
            label={format.name}
            checked={formats.includes(format.slug)}
            onToggle={() => onChange({ formats: toggleInList(formats, format.slug) })}
          />
        ))}
      </div>

      <div className="filters__divider" />

      <div className="filters__group">
        <h3 className="filters__title">Language</h3>
        {options.languages.map((language) => (
          <CheckRow
            key={language.slug}
            label={language.name}
            checked={languages.includes(language.slug)}
            onToggle={() => onChange({ languages: toggleInList(languages, language.slug) })}
          />
        ))}
      </div>

      <div className="filters__divider" />

      <div className="filters__group">
        <h3 className="filters__title">Time of day</h3>
        {options.timeBands.map((band) => {
          const [name, hint] = splitLabel(band.label);
          return (
            <CheckRow
              key={band.id}
              label={name}
              hint={hint}
              checked={times.includes(band.id)}
              onToggle={() => onChange({ times: toggleInList(times, band.id) })}
            />
          );
        })}
      </div>

      <div className="filters__divider" />

      <div className="filters__footer">
        {activeCount > 0 && (
          <button type="button" className="filters__clear text-label-s" onClick={clearAll}>
            Clear filters
          </button>
        )}
        <p className="filters__count text-body-s">
          {activeCount} {activeCount === 1 ? 'filter' : 'filters'} active
        </p>
      </div>
    </div>
  );
}

export default FilterSidebar;