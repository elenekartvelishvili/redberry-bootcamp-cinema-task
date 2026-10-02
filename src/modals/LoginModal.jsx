import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import { validateEmail, validatePassword } from '../utils/validators';

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

  const borderFor = (name) => {
    if (fieldErrors[name] === undefined) return '1px solid #ccc';
    return fieldErrors[name] ? '1px solid red' : '1px solid green';
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
    <Modal title="Log in" onClose={closeModal}>
      <form onSubmit={handleSubmit} noValidate>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => handleChange('email', e.target.value, setEmail)}
          onBlur={() => checkField('email', email)}
          style={{ border: borderFor('email') }}
        />
        {fieldErrors.email && <p>{fieldErrors.email}</p>}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => handleChange('password', e.target.value, setPassword)}
          onBlur={() => checkField('password', password)}
          style={{ border: borderFor('password') }}
        />
        {fieldErrors.password && <p>{fieldErrors.password}</p>}

        {error && <p>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <p>
        Don't have an account?{' '}
        <button type="button" onClick={openRegister}>
          Sign Up
        </button>
      </p>

      <button type="button" onClick={closeModal}>
        Close
      </button>
    </Modal>
  );
}

export default LoginModal;