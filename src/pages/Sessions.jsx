import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getSessions } from '../api/sessions';
import { toDateKey } from '../utils/format';

function Sessions() {
  const [searchParams, setSearchParams] = useSearchParams();

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
    
  }, [searchParams, reloadKey]);

 if(loading) {
  return (
<main className="page">
  <p>Loading sessions...</p>
  </main>
  );
}
if(error) {
  return (
    <main className="page">
      <p>{error}</p>
      <button onClick={() =>  setReloadKey(reloadKey + 1)}>Try again</button>
    </main>
  ); 

}

return (
  <main className="page">
    <h1>Sessions</h1>
    <p>
      Showing {meta.totalSessions} sessions · page {meta.currentPage} of {meta.lastPage}
      </p>
    
   <button onClick={() => updateFilters({ venues: ['galleria'] })}>Test: Galleria only</button>
    <button onClick={() => updateFilters({ page: page + 1 })}>Test: next page</button>

 {movies.map((group) => (
        <div key={group.movie.id}>
          <h3>{group.movie.title}</h3>
          <p>{group.sessions.map((s) => `${s.time} ${s.venue.name}`).join(' | ')}</p>
        </div>
      ))}
    </main>
    
    );

  }

export default Sessions;