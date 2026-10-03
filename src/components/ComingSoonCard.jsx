import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { notifyMovie } from '../api/movies';
import { formatDayMonth } from '../utils/format';
import bellIcon from '../assets/icons/bell.svg';
import './ComingSoonCard.css';

function ComingSoonCard({ movie }) {
  const meta = [movie.genres[0]?.name, `${movie.runtimeMinutes} min`]
    .filter(Boolean)
    .join(' · ');


  const { requireAuth } = useAuth();
  const [notified, setNotified] = useState(movie.isNotified);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const sendNotify = async () => {
    setSending(true);
    setError('');
    try {
      await notifyMovie(movie.slug);
      setNotified(true);
    } catch (err) {
      if (err.status !== 401) setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const handleNotify = () => requireAuth(sendNotify);


  return (
    <div className="soon-card">
      <img src={movie.backdropUrl} alt={movie.title} className="soon-card__image" />

      <div className="soon-card__info">
        <div className="soon-card__text">
          <span className="soon-card__date text-label-s">
            IN CINEMAS {formatDayMonth(movie.releaseDate)}
          </span>
          <h3 className="soon-card__title text-label-m">{movie.title}</h3>
          <p className="soon-card__meta text-body-s">{meta}</p>
          <span className="badge badge--red badge--small text-label-s">
            {movie.ageRating.code}
          </span>
        </div>

        <button
          className={`soon-card__notify text-label-s ${notified ? 'soon-card__notify--done' : ''}`}
          onClick={handleNotify}
          disabled={notified || sending}
        >
          <img src={bellIcon} alt="" width="16" height="16" />
          {notified ? 'Notified ✓' : sending ? 'Saving...' : 'Notify Me'}
        </button>
        {error && <p className="soon-card__error text-body-s">{error}</p>}
      </div>
    </div>
  );
}

export default ComingSoonCard;