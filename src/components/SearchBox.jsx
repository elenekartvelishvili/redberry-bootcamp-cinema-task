import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { searchMovies } from '../api/movies';
import searchIcon from '../assets/icons/search.svg';
import './SearchBox.css';

const DEBOUNCE_MS = 300;

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [retryKey, setRetryKey] = useState(0);
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    const text = query.trim();
    if (!text) {
      setResults([]);
      setLoading(false);
      return;
    }

    let ignore = false;
    setLoading(true);
    setError('');

    const timer = setTimeout(() => {
      searchMovies(text)
        .then((data) => {
          if (!ignore) setResults(data);
        })
        .catch((err) => {
          if (!ignore) setError(err.message);
        })
        .finally(() => {
          if (!ignore) setLoading(false);
        });
    }, DEBOUNCE_MS);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [query, retryKey]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const close = () => {
    setOpen(false);
    setQuery('');
  };

  const browseButton = (
    <Link to="/sessions" className="btn btn--ghost text-button" onClick={close}>
      Browse all sessions
    </Link>
  );

  const renderPanel = () => {
    if (!query.trim()) {
      return (
        <div className="search__empty">
          <span className="search__icon">🍿</span>
          <p className="text-label-m">What do you want to watch?</p>
          <p className="search__muted text-body-s">Search by movie title</p>
          {browseButton}
        </div>
      );
    }

    if (loading) return <p className="search__muted text-body-s">Searching...</p>;

    if (error) {
      return (
        <div className="search__empty">
          <p className="text-body-s">{error}</p>
          <button
            type="button"
            className="btn btn--ghost text-button"
            onClick={() => setRetryKey(retryKey + 1)}
          >
            Try again
          </button>
        </div>
      );
    }

    if (results.length === 0) {
      return (
        <div className="search__empty">
          <span className="search__icon">
            <img src={searchIcon} alt="" width="16" height="16" />
          </span>
          <p className="text-label-m">No results for "{query.trim()}"</p>
          <p className="search__muted text-body-s">Check the spelling or try another film.</p>
          {browseButton}
        </div>
      );
    }

    return (
      <>
        <div className="search__header">
          <span className="search__label text-label-s">Films & events</span>
          <span className="search__muted text-body-s">
            {results.length} {results.length === 1 ? 'result' : 'results'}
          </span>
        </div>

        <div className="search__list">
          {results.map((movie) => (
            <Link key={movie.id} to={`/movies/${movie.slug}`} className="search__item" onClick={close}>
              <img src={movie.posterUrl} alt="" className="search__poster" />
              <span className="search__text">
                <span className="text-label-m">{movie.title}</span>
                <span className="search__muted text-body-s">
                  {capitalize(movie.kind)} · {movie.ageRating.code} · {movie.runtimeMinutes} min
                </span>
              </span>
              {movie.isComingSoon ? (
                <span className="search__soon text-label-s">Coming Soon</span>
              ) : (
                <span className="text-label-m">from ₾{movie.fromPrice}</span>
              )}
            </Link>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="search" ref={boxRef}>
      <label className="navbar__search">
        <img src={searchIcon} alt="" width="14" height="14" />
        <input
          type="search"
          placeholder="Search films and live events"
          className="text-body-m"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setOpen(false);
          }}
        />
      </label>

      {open && <div className="search__panel">{renderPanel()}</div>}
    </div>
  );
}

export default SearchBox;