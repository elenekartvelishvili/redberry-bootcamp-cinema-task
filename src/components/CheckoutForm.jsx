import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../api/booking';
import FormField from './FormField';
import {
  validateFullName,
  validateEmail,
  validateMobile,
  validateCardNumber,
  validateExpiry,
  validateCvv,
} from '../utils/validators';
import './CheckoutForm.css';

const FIELD_NAMES = ['fullName', 'email', 'mobileNumber', 'cardNumber', 'expiry', 'cvv'];

const validateField = (name, values) => {
  if (name === 'fullName') return validateFullName(values.fullName);
  if (name === 'email') return validateEmail(values.email);
  if (name === 'mobileNumber') return validateMobile(values.mobileNumber);
  if (name === 'cardNumber') return validateCardNumber(values.cardNumber);
  if (name === 'expiry') return validateExpiry(values.expiry);
  if (name === 'cvv') return validateCvv(values.cvv);
  return '';
};

function CheckoutForm({ hold, onPaid, onExpired, onSeatsTaken, onBack }) {
  const { user } = useAuth();

  const [values, setValues] = useState({
    fullName: user.fullName ?? '',
    email: user.email,
    mobileNumber: user.mobileNumber ?? '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');

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

    const errors = {};
    FIELD_NAMES.forEach((name) => {
      errors[name] = validateField(name, values);
    });
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) return;

    setError('');
    setPaying(true);
    try {
      const order = await createOrder({ holdId: hold.holdId, ...values });
      onPaid(order);
    } catch (err) {
      if (err.status === 409) {
        onSeatsTaken(err.body.contested);
      } else if (err.status === 422 && !err.errors) {
        onExpired();
      } else if (err.errors) {
        const apiErrors = {};
        for (const [key, messages] of Object.entries(err.errors)) {
          apiErrors[key] = messages[0];
        }
        setFieldErrors((prev) => ({ ...prev, ...apiErrors }));
      } else {
        setError(err.message);
      }
    } finally {
      setPaying(false);
    }
  };

  return (
    <form className="checkout" onSubmit={handleSubmit} noValidate>
      <div className="checkout__fields">
        <h3 className="text-label-m">Your details</h3>
        <FormField label="Full name" type="text" {...fieldProps('fullName')} />
        <FormField label="Email" type="email" {...fieldProps('email')} />
        <FormField label="Mobile number" type="tel" placeholder="5XX XXX XXX" {...fieldProps('mobileNumber')} />

        <h3 className="text-label-m">Card details</h3>
        <FormField
          label="Card number"
          type="text"
          inputMode="numeric"
          placeholder="4242 4242 4242 4242"
          {...fieldProps('cardNumber')}
        />
        <div className="checkout__row">
          <FormField label="Expiry" type="text" placeholder="MM/YY" {...fieldProps('expiry')} />
          <FormField label="CVV" type="password" placeholder="123" maxLength={3} {...fieldProps('cvv')} />
        </div>
      </div>

      <aside className="summary">
        <h3 className="text-label-m">Order summary</h3>
        <ul className="summary__list">
          {hold.seats.map((seat) => (
            <li key={seat.seatId} className="summary__line">
              <span className="text-label-m">{seat.code}</span>
              <span className="text-body-s">{seat.ticketType.name}</span>
              <span className="text-label-m">₾{seat.price}</span>
            </li>
          ))}
        </ul>

        {error && <p className="summary__problem text-label-s">{error}</p>}

        <div className="summary__total">
          <span className="text-label-s">TOTAL</span>
          <span className="text-h2">₾{hold.subtotal}</span>
        </div>

        <button type="submit" className="btn btn--red btn--full text-button" disabled={paying}>
          {paying ? 'Paying...' : 'Pay & Complete Order'}
        </button>
        <button
          type="button"
          className="btn btn--ghost btn--full text-button"
          onClick={onBack}
          disabled={paying}
        >
          Back
        </button>
      </aside>
    </form>
  );
}

export default CheckoutForm;