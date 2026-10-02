import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNowPlaying, getComingSoon } from '../api/movies';
import MovieCard from '../components/MovieCard';
import Hero from '../components/Hero';
function Home() {
  const [nowPlaying, setNowPlaying] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [now, soon] = await Promise.all([getNowPlaying(), getComingSoon()]);
      setNowPlaying(now);
      setComingSoon(soon);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <p>Loading movies...</p>;

  if (error) {
    return (
      <div>
        <p>Couldn't load movies: {error}</p>
        <button onClick={load}>Try again</button>
      </div>
    );
  }

  return (
    <main>
          <Hero />
      <section>
        <h2>Now Playing</h2>
        <Link to="/sessions">See All</Link>
        {nowPlaying.length === 0 ? (
          <p>No movies are playing right now.</p>
        ) : (
          <div style={{ display: 'flex', gap: '16px', overflowX: 'auto' }}>
            {nowPlaying.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2>Coming Soon</h2>
        {comingSoon.length === 0 ? (
          <p>No upcoming movies yet.</p>
        ) : (
          <div style={{ display: 'flex', gap: '16px', overflowX: 'auto' }}>
            {comingSoon.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Home;