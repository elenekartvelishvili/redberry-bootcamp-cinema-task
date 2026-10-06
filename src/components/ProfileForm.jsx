import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOptions } from '../context/OptionsContext';
import { updateProfile } from '../api/profile';
import FormField from './FormField';
import { validateFullName, validateMobile, validateDateOfBirth } from '../utils/validators';
import chevronIcon from '../assets/icons/chevron-down.svg';
import './ProfileForm.css';

const FIELD_NAMES = ['fullName', 'mobileNumber', 'dateOfBirth'];

const validateField = (name, values) => {
  if (name === 'fullName') return validateFullName(values.fullName);
  if (name === 'mobileNumber') return validateMobile(values.mobileNumber);
  if (name === 'dateOfBirth') return validateDateOfBirth(values.dateOfBirth);
  return '';
};

const getStartValues = (user) => ({
  fullName: user.fullName ?? '',
  mobileNumber: user.mobileNumber ?? '',
  dateOfBirth: user.dateOfBirth ?? '',
  preferredVenueId: user.preferredVenue ? String(user.preferredVenue.id) : '',
});

function ProfileForm() {
  const { user, loadUser } = useAuth();
  const { options } = useOptions();

  const [values, setValues] = useState(getStartValues(user));
  const [fieldErrors, setFieldErrors] = useState({});
  const [dateFocused, setDateFocused] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const startValues = getStartValues(user);
  const isChanged = Object.keys(values).some((key) => values[key] !== startValues[key]);
  const isValid = FIELD_NAMES.every((name) => !validateField(name, values));

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...values, [name]: value };
    setValues(next);

    setFieldErrors((prev) =>
      prev[name] !== undefined ? { ...prev, [name]: validateField(name, next) } : prev
    );
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, values) }));
  };

  const fieldProps = (name) => ({
    name,
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
    error: fieldErrors[name],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isChanged || !isValid) return;

    setError('');
    setSaving(true);
    try {
      await updateProfile({
        fullName: values.fullName.trim(),
        mobileNumber: values.mobileNumber.replaceAll(' ', ''),
        dateOfBirth: values.dateOfBirth,
        preferredVenueId: values.preferredVenueId ? Number(values.preferredVenueId) : null,
      });
      await loadUser();
    } catch (err) {
      if (err.errors) {
        const apiErrors = {};
        for (const [key, messages] of Object.entries(err.errors)) {
          apiErrors[key] = messages[0];
        }
        setFieldErrors((prev) => ({ ...prev, ...apiErrors }));
      } else {
        setError(err.message);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit} noValidate>
      <FormField label="Full name" type="text" placeholder="Your full name" {...fieldProps('fullName')} />

      <div>
        <FormField label="Email" type="email" value={user.email} disabled />
        <p className="profile-form__hint text-body-s">Set at registration and cannot be changed</p>
      </div>

      <FormField label="Mobile number" type="tel" placeholder="5XX XXX XXX" {...fieldProps('mobileNumber')} />

      <FormField
        label="Date of birth"
        type={dateFocused || values.dateOfBirth ? 'date' : 'text'}
        placeholder="e.g. Text"
        {...fieldProps('dateOfBirth')}
        onFocus={() => setDateFocused(true)}
        onBlur={(e) => {
          setDateFocused(false);
          handleBlur(e);
        }}
      />

      <label className="field">
        <span className="field__label text-label-s">Preferred Venue (Optional)</span>
        <span className="field__box">
          <select
            className={`field__input text-label-s ${values.preferredVenueId ? '' : 'profile-form__empty'}`}
            name="preferredVenueId"
            value={values.preferredVenueId}
            onChange={handleChange}
          >
            <option value="">e.g. Text</option>
            {options?.venues.map((venue) => (
              <option key={venue.id} value={venue.id}>
                {venue.name}
              </option>
            ))}
          </select>
          <img src={chevronIcon} alt="" width="16" height="16" />
        </span>
      </label>

      {error && <p className="field__error text-label-s">{error}</p>}

      <button
        type="submit"
        className="btn btn--red text-button profile-form__save"
        disabled={!isChanged || !isValid || saving}
      >
        {saving ? 'Saving...' : 'Save changes'}
      </button>
    </form>
  );
}

export default ProfileForm;