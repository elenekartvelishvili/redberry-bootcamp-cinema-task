import chevronIcon from '../assets/icons/chevron-down.svg';

function SortSelect({ sorts, value, onChange }) {
  return (
    <label className="sort">
      <span className="sort__label text-body-m">Sort:</span>

      <select
        className="sort__select text-button"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {sorts.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>

      <img src={chevronIcon} alt="" width="16" height="16" />
    </label>
  );
}

export default SortSelect;