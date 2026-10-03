import { Link } from 'react-router-dom';
import './MovieCard.css';

function MovieCard({ movie }) {
  const meta = [movie.genres[0]?.name, `${movie.runtimeMinutes} min`]
    .filter(Boolean)
    .join(' · ');

  return (
    <Link to={`/movies/${movie.slug}`} className="movie-card">
      <img src={movie.posterUrl} alt={movie.title} className="movie-card__poster" />

      <div className="movie-card__info">
        <h3 className="movie-card__title text-h3">{movie.title}</h3>
        <p className="movie-card__meta text-body-s">{meta}</p>
        <span className="badge badge--red badge--small text-label-s">
          {movie.ageRating.code}
        </span>
      </div>

      <div className="movie-card__footer">
        <span className="text-label-s">From ₾ {movie.fromPrice}</span>
        <span className="btn btn--red btn--small text-button">Buy Ticket</span>
      </div>
    </Link>
  );
}

export default MovieCard;