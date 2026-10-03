import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNowPlaying, getComingSoon } from '../api/movies';
import Hero from '../components/Hero';
import MovieCard from '../components/MovieCard';
import ComingSoonCard from '../components/ComingSoonCard';
import './Home.css';

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

      <div className="home__sections">
        <section className="home-section">
          <div className="home-section__header">
            <h2 className="text-h1">NOW PLAYING</h2>
            <Link to="/sessions" className="home-section__link text-label-m">
              See all
            </Link>
          </div>

          {nowPlaying.length === 0 ? (
            <p className="text-body-m">No movies are playing right now.</p>
          ) : (
            <div className="home-section__row-wrap">
              <div className="home-section__row">
                {nowPlaying.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </div>
          )}
        </section>

        <hr className="home__divider" />

        <section className="home-section">
          <div className="home-section__header">
            <h2 className="text-h1">COMING SOON...</h2>
            <Link to="/sessions" className="home-section__link text-label-m">
              See all
            </Link>
          </div>

          {comingSoon.length === 0 ? (
            <p className="text-body-m">No upcoming movies yet.</p>
          ) : (
            <div className="home-section__row-wrap">
              <div className="home-section__row home-section__row--soon">
                {comingSoon.map((movie) => (
                  <ComingSoonCard key={movie.id} movie={movie} />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Home;