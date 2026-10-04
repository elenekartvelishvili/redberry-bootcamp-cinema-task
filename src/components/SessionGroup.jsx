import { Link } from 'react-router-dom';
import SessionCard from './SessionCard';
import './SessionGroup.css';

function SessionGroup({ movie, sessions, onSelect }) {
  return (
    <div className="session-group">
      <div className="session-group__movie">
        <img src={movie.posterUrl} alt={movie.title} className="session-group__poster" />
        <div className="session-group__info">
          <div className="session-group__title-row">
            <Link to={`/movies/${movie.slug}`} className="text-h3">
              {movie.title}
            </Link>
            <span className="badge badge--red badge--small text-label-s">
              {movie.ageRating.code}
            </span>
          </div>
          <p className="session-group__runtime text-body-m">{movie.runtimeMinutes} min</p>
        </div>
      </div>

      <div className="session-group__cards">
        {sessions.map((session) => (
          <SessionCard key={session.id} session={session} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

export default SessionGroup;