import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOptions } from '../context/OptionsContext';
import { getSession, getSessionSeats, holdSeats } from '../api/booking';
import { isTooYoung } from '../utils/age';
import Modal from '../components/Modal';
import SeatMap from '../components/SeatMap';
import BookingSummary from '../components/BookingSummary';
import './BookingModal.css';

const formatSessionDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

function BookingModal({ sessionId, onClose }) {
  const { user } = useAuth();
  const { options } = useOptions();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [seatMap, setSeatMap] = useState(null);
  const [seatsReloadKey, setSeatsReloadKey] = useState(0);
  const [error, setError] = useState('');

  const [step, setStep] = useState('seats');
  const [selected, setSelected] = useState([]);
  const [seatMessage, setSeatMessage] = useState('');
  const [holding, setHolding] = useState(false);
  const [hold, setHold] = useState(null);

  useEffect(() => {
    let ignore = false;

    getSession(sessionId)
      .then((data) => {
        if (!ignore) setSession(data);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      });

    return () => {
      ignore = true;
    };
  }, [sessionId]);

  useEffect(() => {
    let ignore = false;

    getSessionSeats(sessionId)
      .then((data) => {
        if (!ignore) setSeatMap(data);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      });

    return () => {
      ignore = true;
    };
  }, [sessionId, seatsReloadKey]);

  const goToProfile = () => {
    onClose();
    navigate('/profile');
  };

  const handleSeatClick = (seat) => {
    setSeatMessage('');

    const isSelected = selected.some((item) => item.id === seat.id);
    if (isSelected) {
      setSelected(selected.filter((item) => item.id !== seat.id));
      return;
    }

    if (selected.length >= options.maxSeatsPerOrder) {
      setSeatMessage(`You can select up to ${options.maxSeatsPerOrder} seats per order.`);
      return;
    }

    setSelected([...selected, { id: seat.id, code: seat.code, ticketType: 'adult' }]);
  };

  const handleTypeChange = (seatId, ticketType) => {
    setSelected(selected.map((item) => (item.id === seatId ? { ...item, ticketType } : item)));
  };

  const handleNext = async () => {
    setSeatMessage('');
    setHolding(true);

    try {
      const seats = selected.map((item) => ({ seatId: item.id, ticketType: item.ticketType }));
      const data = await holdSeats(sessionId, seats);
      setHold(data);
      setStep('checkout');
    } catch (err) {
      if (err.status === 409) {
        const lostCodes = err.body.contested;
        setSelected(selected.filter((item) => !lostCodes.includes(item.code)));
        setSeatMessage(`Sorry, these seats were just taken: ${lostCodes.join(', ')}. Please pick others.`);
        setSeatsReloadKey(seatsReloadKey + 1);
      } else {
        setSeatMessage(err.message);
      }
    } finally {
      setHolding(false);
    }
  };

  const subtitle = session
    ? [
        session.venue.name,
        `Hall ${session.hall.name}`,
        formatSessionDate(session.date),
        session.time,
        session.format.name,
        session.language.name,
      ].join(' · ')
    : '';

  const stepClass = (name) =>
    `booking__step text-label-s ${step === name ? 'booking__step--active' : ''}`;

  const renderBody = () => {
    if (!user.profileComplete) {
      return (
        <div className="booking__notice">
          <p className="text-body-m">Please complete your profile to enable booking.</p>
          <button type="button" className="btn btn--red text-button" onClick={goToProfile}>
            Complete profile
          </button>
        </div>
      );
    }

    if (error) return <p className="text-body-m">{error}</p>;
    if (!session || !seatMap || !options) return <p className="text-body-m">Loading...</p>;

    if (step === 'checkout') {
      return (
        <p className="text-body-m">
          Seats held: {hold.seats.map((seat) => seat.code).join(', ')}. Checkout comes tomorrow.
        </p>
      );
    }

    return (
      <div className="booking__body">
        <div className="booking__map">
          <SeatMap sections={seatMap.sections} selected={selected} onSeatClick={handleSeatClick} />
          {seatMessage && <p className="booking__message text-label-s">{seatMessage}</p>}
        </div>

        <BookingSummary
          selected={selected}
          ticketTypes={options.ticketTypes}
          price={session.price}
          movie={session.movie}
          tooYoung={isTooYoung(user, session.movie.ageRating.minAge)}
          maxSeats={options.maxSeatsPerOrder}
          holding={holding}
          onTypeChange={handleTypeChange}
          onNext={handleNext}
        />
      </div>
    );
  };

  return (
    <Modal
      title={session ? session.movie.title : 'Loading...'}
      subtitle={subtitle}
      onClose={onClose}
      className="modal--booking"
    >
      <div className="booking__steps">
        <span className={stepClass('seats')}>Seats</span>
        <span className={stepClass('checkout')}>Checkout</span>
      </div>

      {renderBody()}
    </Modal>
  );
}

export default BookingModal;