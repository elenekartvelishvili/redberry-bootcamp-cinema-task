import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovie } from '../api/movies';
import { formatLongDate } from '../utils/format';
import timerIcon from '../assets/icons/timer.svg';
import './MovieDetails.css';

function InfoRow({ label, value }) {
  return (
    <div className="info-row">
      <span className="info-row__label">{label}</span>
      <span className="info-row__value">{value}</span>
    </div>
  );
}

function MovieDetails() {
  const { slug } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    setLoading(true);
    setError('');

    getMovie(slug)
      .then((data) => {
        if (!ignore) setMovie(data);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [slug, reloadKey]);

  if (loading) {
    return (
      <main className="page details-status">
        <p className="text-body-m">Loading movie...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page details-status">
        <p className="text-body-m">Couldn't load this movie: {error}</p>
        <button className="btn btn--ghost text-button" onClick={() => setReloadKey(reloadKey + 1)}>
          Try again
        </button>
      </main>
    );
  }
    const formatNames = movie.formats.map((format) => format.name).join(', ');
  const genreNames = movie.genres.map((genre) => genre.name).join(', ');

  return (
    <main>
      <section className="details-hero">
        <img src={movie.backdropUrl} alt="" className="details-hero__bg" />
        <div className="details-hero__shade" />

        <div className="details-hero__content">
          <img src={movie.posterUrl} alt={movie.title} className="details-hero__poster" />

          <div className="details-hero__info">
            <span className="badge badge--red text-label-s">
              {movie.isComingSoon ? 'COMING SOON' : 'NOW PLAYING'}
            </span>
            <h1 className="details-hero__title text-display">{movie.title}</h1>
            <p className="details-hero__text text-body-m">{movie.synopsis}</p>

            <div className="details-hero__tags">
              <span className="badge badge--red text-label-s">{movie.ageRating.code}</span>
              <span className="badge text-label-s">
                <img src={timerIcon} alt="" width="14" height="14" />
                {movie.runtimeMinutes} Min
              </span>
              {movie.formats.map((format) => (
                <span key={format.id} className="badge text-label-s">
                  {format.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="details-body">
        <section className="details-body__main">
          {/* Part B: dates + sessions go here */}
        </section>

        <aside className="details-info">
          <h2 className="text-h2">Details</h2>
          <InfoRow label="Director" value={movie.director} />
          <InfoRow label="Main cast" value={movie.cast} />
          <InfoRow label="Genre" value={genreNames} />
          <InfoRow label="Duration" value={`${movie.runtimeMinutes} minutes`} />
          <InfoRow label="Release date" value={formatLongDate(movie.releaseDate)} />
          <InfoRow label="Formats" value={formatNames} />
          <InfoRow label="From" value={`₾${movie.fromPrice}`} />

          <div className="rating-note">
            <span className="text-label-s">RATING NOTE</span>
            <div className="rating-note__row text-body-s">
              <strong>{movie.ageRating.code}</strong>
              <span>{movie.ageRating.description}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default MovieDetails;