import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getSession } from '../api/booking';
import Modal from '../components/Modal';
import './BookingModal.css';

const formatSessionDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

function BookingModal({ sessionId, onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [error, setError] = useState('');

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

  const goToProfile = () => {
    onClose();
    navigate('/profile');
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
    if (!session) return <p className="text-body-m">Loading...</p>;

    return <p className="text-body-m">Seat map comes next</p>;
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