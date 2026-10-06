import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOptions } from '../context/OptionsContext';
import { getSession, getSessionSeats } from '../api/booking';
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
  const [error, setError] = useState('');
  const [selected, setSelected] = useState([]);
  const [seatMessage, setSeatMessage] = useState('');

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
  }, [sessionId]);

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

    const adult = options.ticketTypes.find((type) => type.slug === 'adult');
    setSelected([...selected, { id: seat.id, code: seat.code, ticketTypeId: adult.id }]);
  };

  const handleTypeChange = (seatId, ticketTypeId) => {
    setSelected(
      selected.map((item) => (item.id === seatId ? { ...item, ticketTypeId } : item))
    );
  };

  const handleNext = () => {
    console.log('hold these seats:', selected);
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
        <span className="booking__step booking__step--active text-label-s">Seats</span>
        <span className="booking__step text-label-s">Checkout</span>
      </div>

      {renderBody()}
    </Modal>
  );
}

export default BookingModal;