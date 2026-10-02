import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import {
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from '../utils/validators';

const FIELDS = [
  { name: 'username', type: 'text', placeholder: 'Username' },
  { name: 'email', type: 'email', placeholder: 'Email' },
  { name: 'password', type: 'password', placeholder: 'Password' },
  { name: 'confirmPassword', type: 'password', placeholder: 'Confirm Password' },
];

const validateField = (name, values) => {
  if (name === 'username') return validateUsername(values.username);
  if (name === 'email') return validateEmail(values.email);
  if (name === 'password') return validatePassword(values.password);
  if (name === 'confirmPassword')
    return validateConfirmPassword(values.confirmPassword, values.password);
  return '';
};

function RegisterModal() {
  const { register, closeModal, openLogin } = useAuth();

  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...values, [name]: value };
    setValues(next);

    setFieldErrors((prev) => {
      const updated = { ...prev };
      if (prev[name] !== undefined) updated[name] = validateField(name, next);
      // changing password can make "confirm" right or wrong again
      if (name === 'password' && prev.confirmPassword !== undefined) {
        updated.confirmPassword = validateField('confirmPassword', next);
      }
      return updated;
    });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, values) }));
  };

  const borderFor = (name) => {
    if (fieldErrors[name] === undefined) return '1px solid #ccc';
    return fieldErrors[name] ? '1px solid red' : '1px solid green';
  };
    const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState('');
  const [avatarError, setAvatarError] = useState('');

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    let problem = '';
    if (!allowed.includes(file.type)) problem = 'Avatar must be a JPG, PNG or WebP image';
    else if (file.size > 2 * 1024 * 1024) problem = 'Avatar must be smaller than 2MB';

    if (problem) {
      setAvatarError(problem);
      setAvatar(null);
      setPreview('');
      e.target.value = '';
      return;
    }

    setAvatarError('');
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);
    const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const errors = {};
    FIELDS.forEach(({ name }) => {
      errors[name] = validateField(name, values);
    });
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean) || avatarError) return;

    const formData = new FormData();
    formData.append('username', values.username);
    formData.append('email', values.email);
    formData.append('password', values.password);
    formData.append('password_confirmation', values.confirmPassword);
    if (avatar) formData.append('avatar', avatar);

    setLoading(true);
    try {
      await register(formData);
    } catch (err) {
      if (err.errors) {
        const apiErrors = {};
        for (const [key, messages] of Object.entries(err.errors)) {
          const field = key === 'password_confirmation' ? 'confirmPassword' : key;
          apiErrors[field] = messages[0];
        }
        if (apiErrors.avatar) setAvatarError(apiErrors.avatar);
        setFieldErrors((prev) => ({ ...prev, ...apiErrors }));
      } else {
        setError(err.message);
      }
      setLoading(false);
    }
  };

  return (
    <Modal title="Sign up" onClose={closeModal}>
      <form onSubmit={handleSubmit} noValidate>
        {FIELDS.map(({ name, type, placeholder }) => (
          <div key={name}>
            <input
              name={name}
              type={type}
              placeholder={placeholder}
              value={values[name]}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ border: borderFor(name) }}
            />
            {fieldErrors[name] && <p>{fieldErrors[name]}</p>}
          </div>
        ))}

        <label>
          Avatar (optional)
          <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleAvatar} />
        </label>
        {preview && <img src={preview} alt="Avatar preview" width="80" height="80" />}
        {avatarError && <p>{avatarError}</p>}

        {error && <p>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>

      <p>
        Already have an account?{' '}
        <button type="button" onClick={openLogin}>
          Log In
        </button>
      </p>

      <button type="button" onClick={closeModal}>
        Close
      </button>
    </Modal>
  );
}

export default RegisterModal;