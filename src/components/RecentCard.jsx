import { Link } from 'react-router-dom';
import './RecentCard.css';

function RecentCard({ movie }) {
  const meta = [movie.genre, `${movie.runtimeMinutes} min`].filter(Boolean).join(' · ');

  return (
    <Link to={`/movies/${movie.slug}`} className="recent-card">
      <img src={movie.backdropUrl} alt="" className="recent-card__image" />
      <div className="recent-card__info">
        <h3 className="recent-card__title text-button">{movie.title}</h3>
        <p className="recent-card__meta text-body-s">{meta}</p>
        <span className="badge badge--red badge--small text-label-s">{movie.ageCode}</span>
      </div>
    </Link>
  );
}

export default RecentCard;