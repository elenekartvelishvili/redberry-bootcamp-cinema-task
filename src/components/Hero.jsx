import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFeatured, getMovie } from '../api/movies';
import { formatDate } from '../utils/format';
import ticketIcon from '../assets/icons/ticket.svg';
import arrowIcon from '../assets/icons/arrow-left.svg';
import timerIcon from '../assets/icons/timer.svg';
import './Hero.css';

const SLIDE_TIME = 6000;

function Hero() {
  const [movies, setMovies] = useState([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const featured = await getFeatured();
      const details = await Promise.all(featured.map((m) => getMovie(m.slug)));
      setMovies(details);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (movies.length < 2) return;
    const timer = setTimeout(() => {
      setActive((i) => (i + 1) % movies.length);
    }, SLIDE_TIME);
    return () => clearTimeout(timer);
  }, [active, movies.length]);

  const goTo = (i) => setActive((i + movies.length) % movies.length);
    if (loading) return <section className="hero hero--loading" />;

  if (error) {
    return (
      <section className="hero hero--error">
        <p className="text-body-m">Couldn't load featured movies.</p>
        <button className="btn btn--ghost text-button" onClick={load}>
          Try again
        </button>
      </section>
    );
  }

  if (movies.length === 0) return null;

  const movie = movies[active];

  return (
    <section className="hero">
      {movies.map((m, i) => (
        <img
          key={m.id}
          src={m.backdropUrl}
          alt=""
          className={`hero__bg ${i === active ? 'hero__bg--active' : ''}`}
        />
      ))}
      <div className="hero__shade" />

      <div className="hero__content" key={movie.id}>
        <span className="badge badge--red text-label-s">
          PREMIERE · {formatDate(movie.releaseDate).toUpperCase()}
        </span>

        <h1 className="hero__title text-display">{movie.title}</h1>

        <div className="hero__tags">
          <span className="badge badge--red text-label-s">{movie.ageRating.code}</span>
          <span className="badge text-label-s">
            <img src={timerIcon} alt="" width="14" height="14" />
            {movie.runtimeMinutes} Min
          </span>
          {movie.formats.map((f) => (
            <span key={f.id} className="badge text-label-s">
              {f.name}
            </span>
          ))}
        </div>

        <p className="hero__text text-body-m">{movie.synopsis}</p>

        <div className="hero__buttons">
          <Link to={`/movies/${movie.slug}`} className="btn btn--red text-button">
            <img src={ticketIcon} alt="" width="16" height="16" />
            Buy tickets
          </Link>
          <Link to="/sessions" className="btn btn--ghost text-button">
            All sessions
          </Link>
        </div>
      </div>

      <div className="hero__controls">
        <div className="hero__bars">
          {movies.map((m, i) => (
            <button
              key={m.id}
              className="hero__bar"
              onClick={() => setActive(i)}
              aria-label={`Show ${m.title}`}
            >
              {i === active && (
                <span
                  className="hero__bar-fill"
                  style={{ animationDuration: `${SLIDE_TIME}ms` }}
                />
              )}
            </button>
          ))}
        </div>

        <button className="hero__arrow" onClick={() => goTo(active - 1)} aria-label="Previous">
          <img src={arrowIcon} alt="" width="34" height="34" />
        </button>
        <button
          className="hero__arrow hero__arrow--next"
          onClick={() => goTo(active + 1)}
          aria-label="Next"
        >
          <img src={arrowIcon} alt="" width="34" height="34" />
        </button>
      </div>
    </section>
  );
}

export default Hero;