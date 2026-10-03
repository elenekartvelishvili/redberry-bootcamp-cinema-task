import bellIcon from '../assets/icons/bell.svg';
import { formatDayMonth } from '../utils/format';
import './ComingSoonCard.css';

function ComingSoonCard({ movie }) {
  const meta = [movie.genres[0]?.name, `${movie.runtimeMinutes} min`]
    .filter(Boolean)
    .join(' · ');

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

        <button className="soon-card__notify text-label-s">
          <img src={bellIcon} alt="" width="16" height="16" />
          Notify Me
        </button>
      </div>
    </div>
  );
}

export default ComingSoonCard;