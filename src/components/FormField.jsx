import checkIcon from '../assets/icons/check.svg';
import errorIcon from '../assets/icons/error.svg';
import './FormField.css';

function FormField({ label, error, ...inputProps }) {
  const checked = error !== undefined;
  const invalid = Boolean(error);
  const stateClass = !checked ? '' : invalid ? 'field--error' : 'field--valid';

  return (
    <label className={`field ${stateClass}`}>
      <span className="field__label text-label-s">{label}</span>

      <span className="field__box">
        <input className="field__input text-label-s" {...inputProps} />
        {checked && (
          <img src={invalid ? errorIcon : checkIcon} alt="" width="16" height="16" />
        )}
      </span>

      {invalid && <span className="field__error text-label-s">{error}</span>}
    </label>
  );
}

export default FormField;