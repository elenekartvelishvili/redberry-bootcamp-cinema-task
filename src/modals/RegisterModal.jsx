import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import {
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from '../utils/validators';
import defaultAvatar from '../assets/images/default-avatar.png';
import './AuthForm.css';

const FIELD_NAMES = ['username', 'email', 'password', 'confirmPassword'];

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

  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState('');
  const [avatarError, setAvatarError] = useState('');

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

  const fieldProps = (name) => ({
    name,
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
    error: fieldErrors[name],
  });

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
    FIELD_NAMES.forEach((name) => {
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
    <Modal
      title="Sign up"
      subtitle="Welcome to Kino XII"
      onClose={closeModal}
      className="modal--register"
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-form__avatar">
          <label className="avatar-upload">
            <img src={preview || defaultAvatar} alt="" />
            <span className="avatar-upload__text">
              <span className="text-button">Upload avatar (optional)</span>
              <span className="avatar-upload__hint text-body-s">JPG, PNG or WEBP</span>
            </span>
            <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleAvatar} />
          </label>
          {avatarError && <p className="field__error text-label-s">{avatarError}</p>}
        </div>

        <div className="auth-form__fields">
          <FormField label="Username" type="text" placeholder="User" {...fieldProps('username')} />
          <FormField
            label="Email"
            type="email"
            placeholder="example@gmail.com"
            {...fieldProps('email')}
          />
          <div className="auth-form__row">
            <FormField
              label="Password"
              type="password"
              placeholder="••••••••"
              {...fieldProps('password')}
            />
            <FormField
              label="Confirm password"
              type="password"
              placeholder="••••••••"
              {...fieldProps('confirmPassword')}
            />
          </div>
        </div>

        {error && <p className="auth-form__api-error text-label-s">{error}</p>}

        <div className="auth-form__actions">
          <button type="submit" className="btn btn--red btn--full text-button" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
          <p className="auth-form__switch text-body-m">
            Already have an account?
            <button type="button" className="auth-form__switch-btn text-button" onClick={openLogin}>
              Log in
            </button>
          </p>
        </div>
      </form>
    </Modal>
  );
}

export default RegisterModal;