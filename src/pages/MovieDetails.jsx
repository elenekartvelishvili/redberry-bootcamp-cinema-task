import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovie, getMovieSessions } from '../api/movies';
import { formatLongDate, toDateKey, getNextDays } from '../utils/format';
import { useAuth } from '../context/AuthContext';
import { addRecentlyViewed } from '../utils/recentlyViewed';
import SessionTicket from '../components/SessionTicket';
import BookingModal from '../modals/BookingModal';
import timerIcon from '../assets/icons/timer.svg';
import { isTooYoung } from '../utils/age';
import './MovieDetails.css';

function InfoRow({ label, value }) {
  return (
    <div className="info-row">
      <span className="info-row__label">{label}</span>
      <span className="info-row__value">{value}</span>
    </div>
  );
}

const groupByHall = (sessions) => {
  const halls = {};
  sessions.forEach((session) => {
    const hallName = session.hall.name;
    if (!halls[hallName]) halls[hallName] = [];
    halls[hallName].push(session);
  });
  return Object.entries(halls);
};

function MovieDetails() {
  const { slug } = useParams();
  const { user, requireAuth } = useAuth();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const [date, setDate] = useState(toDateKey(new Date()));
  const [venues, setVenues] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsError, setSessionsError] = useState('');
  const [sessionsReloadKey, setSessionsReloadKey] = useState(0);

  const [bookingSessionId, setBookingSessionId] = useState(null);

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

  useEffect(() => {
    let ignore = false;

    setSessionsLoading(true);
    setSessionsError('');

    getMovieSessions(slug, date)
      .then((data) => {
        if (!ignore) setVenues(data);
      })
      .catch((err) => {
        if (!ignore) setSessionsError(err.message);
      })
      .finally(() => {
        if (!ignore) setSessionsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [slug, date, sessionsReloadKey]);

  useEffect(() => {
    if (movie) addRecentlyViewed(movie);
  }, [movie]);

  const handleSelectSession = (session) => {
    requireAuth(() => setBookingSessionId(session.id));
  };

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

  
  const tooYoung = isTooYoung(user, movie.ageRating.minAge);


  let sessionCount = 0;
  venues.forEach((venue) => {
    sessionCount += venue.sessions.length;
  });

  const renderSessions = () => {
    if (movie.isComingSoon) {
      return (
        <p className="text-body-m">
          Tickets go on sale when the film opens on {formatLongDate(movie.releaseDate)}.
        </p>
      );
    }

    if (sessionsLoading) {
      return <p className="text-body-m">Loading sessions...</p>;
    }

    if (sessionsError) {
      return (
        <div className="details-status-inline">
          <p className="text-body-m">{sessionsError}</p>
          <button
            className="btn btn--ghost text-button"
            onClick={() => setSessionsReloadKey(sessionsReloadKey + 1)}
          >
            Try again
          </button>
        </div>
      );
    }

    if (venues.length === 0) {
      return <p className="text-body-m">No sessions on this day. Try another date.</p>;
    }

    return venues.map((group) => (
      <div key={group.venue.id} className="details-venue">
        <h3 className="text-button">{group.venue.name}</h3>
        <div className="details-venue__halls">
          {groupByHall(group.sessions).map(([hallName, hallSessions]) => (
            <div key={hallName} className="details-hall">
              <span className="text-label-s">Hall {hallName}</span>
              <div className="details-hall__tickets">
                {hallSessions.map((session) => (
                  <SessionTicket
                    key={session.id}
                    session={session}
                    disabled={tooYoung}
                    onSelect={handleSelectSession}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    ));
  };

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
          <div className="details-sessions__header">
            <h2 className="text-h2">Sessions</h2>
            {!movie.isComingSoon && !sessionsLoading && !sessionsError && (
              <p className="details-sessions__count text-body-s">
                {sessionCount} sessions on this day
              </p>
            )}
          </div>

          {!movie.isComingSoon && (
            <div className="details-days">
              {getNextDays().map((day) => {
                const key = toDateKey(day);
                return (
                  <button
                    key={key}
                    type="button"
                    className={`details-day ${key === date ? 'details-day--active' : ''}`}
                    onClick={() => setDate(key)}
                  >
                    <span className="text-label-s">
                      {day.toLocaleDateString('en-GB', { weekday: 'short' })}
                    </span>
                    <span className="text-h3">{day.getDate()}</span>
                  </button>
                );
              })}
            </div>
          )}

          {tooYoung && (
            <p className="details-age-warning text-label-m">
              This film is rated {movie.ageRating.code}. You cannot buy tickets for it with this
              account.
            </p>
          )}

          {renderSessions()}
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

      {bookingSessionId && (
        <BookingModal sessionId={bookingSessionId} onClose={() => setBookingSessionId(null)} />
      )}
    </main>
  );
}

export default MovieDetails;