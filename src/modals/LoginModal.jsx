import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import { validateEmail, validatePassword } from '../utils/validators';
import './AuthForm.css';

const validators = {
  email: validateEmail,
  password: validatePassword,
};

function LoginModal() {
  const { login, closeModal, openRegister } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  const [fieldErrors, setFieldErrors] = useState({});

  const checkField = (name, value) => {
    setFieldErrors((prev) => ({ ...prev, [name]: validators[name](value) }));
  };

  const handleChange = (name, value, setValue) => {
    setValue(value);
    
    if (fieldErrors[name] !== undefined) checkField(name, value);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const errors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setFieldErrors(errors);

    if (errors.email || errors.password) return;

    setLoading(true);
    try {
      await login({ email, password });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

   return (
    <Modal
      title="Log in"
      subtitle="Welcome back to Kino XII"
      onClose={closeModal}
      className="modal--login"
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-form__fields">
          <FormField
            label="Email"
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => handleChange('email', e.target.value, setEmail)}
            onBlur={() => checkField('email', email)}
            error={fieldErrors.email}
          />
          <FormField
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => handleChange('password', e.target.value, setPassword)}
            onBlur={() => checkField('password', password)}
            error={fieldErrors.password}
          />
        </div>

        {error && <p className="auth-form__api-error text-label-s">{error}</p>}

        <div className="auth-form__actions">
          <button type="submit" className="btn btn--red btn--full text-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
          <p className="auth-form__switch text-body-m">
            Don't have an account?
            <button type="button" className="auth-form__switch-btn text-button" onClick={openRegister}>
              Sign up
            </button>
          </p>
        </div>
      </form>
    </Modal>
  );
}

export default LoginModal;