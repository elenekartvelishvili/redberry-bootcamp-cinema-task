import chevronIcon from '../assets/icons/chevron-down.svg';

function SortSelect({ sorts, value, onChange }) {
  const selected = sorts.find((option) => option.id === value);

  return (
    <label className="sort">
      <span className="sort__label text-body-m">Sort:</span>
      <span className="text-button">{selected ? selected.label : ''}</span>
      <img src={chevronIcon} alt="" width="16" height="16" />

      <select
        className="sort__select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {sorts.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default SortSelect;