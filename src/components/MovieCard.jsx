import { Link } from 'react-router-dom';
import { formatRuntime, formatDate } from '../utils/format';

function MovieCard({ movie }) {
  return (
    <div>
      <img src={movie.posterUrl} alt={movie.title} width="200" />
      <h3>{movie.title}</h3>
      <span>{movie.ageRating.code}</span>
      <span>{formatRuntime(movie.runtimeMinutes)}</span>

      {movie.isComingSoon ? (
        <p>Release: {formatDate(movie.releaseDate)}</p>
      ) : (
        <>
          <p>from ₾{movie.fromPrice}</p>
          <Link to={`/movies/${movie.slug}`}>Buy Ticket</Link>
        </>
      )}
    </div>
  );
}

export default MovieCard;