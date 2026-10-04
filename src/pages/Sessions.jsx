import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getSessions } from '../api/sessions';
import { toDateKey } from '../utils/format';
import { useOptions } from '../context/OptionsContext';
import FilterSidebar from '../components/FilterSidebar';
import './Sessions.css';

function Sessions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { options } = useOptions();

  const readList = (name) => {
    const value = searchParams.get(name);
    return value ? value.split(',') : [];
  };

  const venues = readList('venues');
  const formats = readList('formats');
  const languages = readList('languages');
  const times = readList('times');
  const date = searchParams.get('date') || toDateKey(new Date());
  const sort = searchParams.get('sort') || 'time_asc';
  const page = Number(searchParams.get('page')) || 1;

  const updateFilters = (changes) => {
    const next = new URLSearchParams(searchParams);

    for (const [key, value] of Object.entries(changes)) {
      const isEmpty = Array.isArray(value) ? value.length === 0 : !value;
      if (isEmpty) next.delete(key);
      else next.set(key, Array.isArray(value) ? value.join(',') : value);
    }

    if (!('page' in changes)) next.delete('page');

    setSearchParams(next);
  };

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [meta, setMeta] = useState({});
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    setLoading(true);
    setError('');

    getSessions({ venues, formats, languages, bands: times, date, sort, page })
      .then((response) => {
        if (ignore) return;
        setMovies(response.data);
        setMeta(response.meta);
      })
      .catch((err) => {
        if (ignore) return;
        setError(err.message);
      })
      .finally(() => {
        if (ignore) return;
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, reloadKey]);

  return (
    <main className="page sessions">
      <aside className="sessions__side">
        <div className="sessions__header">
          <h1 className="text-h1">Sessions</h1>
          <p className="sessions__subtitle text-body-m">Browse showtimes across all venues</p>
        </div>

        <FilterSidebar
          options={options}
          venues={venues}
          formats={formats}
          languages={languages}
          times={times}
          date={date}
          onChange={updateFilters}
        />
      </aside>

      <section className="sessions__main">
        {loading ? (
          <p className="text-body-m">Loading sessions...</p>
        ) : error ? (
          <div className="sessions__status">
            <p className="text-body-m">{error}</p>
            <button
              className="btn btn--ghost text-button"
              onClick={() => setReloadKey(reloadKey + 1)}
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <p className="text-label-m">Showing {meta.totalSessions} sessions</p>
            {movies.map((group) => (
              <div key={group.movie.id}>
                <h3>{group.movie.title}</h3>
                <p>{group.sessions.map((s) => `${s.time} ${s.venue.name}`).join(' | ')}</p>
              </div>
            ))}
          </>
        )}
      </section>
    </main>
  );
}

export default Sessions;