import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTickets } from '../api/tickets';
import ProfileForm from '../components/ProfileForm';
import MyTickets from '../components/MyTickets';
import './Profile.css';

const getAgeText = (age) => {
  if (age < 16) return `You are ${age}, so you cannot buy tickets for 16+ or 18+ titles.`;
  if (age < 18) return `You are ${age}, so you cannot buy tickets for 18+ titles.`;
  return `You are ${age}, so you can buy tickets for all titles.`;
};

function ProfileStatus({ user }) {
  return (
    <div className="profile__status">
      {user.profileComplete ? (
        <p className="profile__banner profile__banner--complete text-label-m">Profile Complete ✓</p>
      ) : (
        <p className="profile__banner profile__banner--incomplete text-label-m">
          Please complete your profile to enable booking.
        </p>
      )}

      {user.age !== null && <p className="profile__age text-body-m">{getAgeText(user.age)}</p>}
    </div>
  );
}

function Profile() {
  const { user, loading, openLogin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'info';

  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [ticketsError, setTicketsError] = useState('');
  const [ticketsReloadKey, setTicketsReloadKey] = useState(0);

  useEffect(() => {
    if (!loading && !user) openLogin();
  }, [loading, user, openLogin]);

  useEffect(() => {
    if (!user) return;
    let ignore = false;

    setTicketsLoading(true);
    setTicketsError('');

    getTickets()
      .then((data) => {
        if (!ignore) setTickets(data);
      })
      .catch((err) => {
        if (!ignore) setTicketsError(err.message);
      })
      .finally(() => {
        if (!ignore) setTicketsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [user, ticketsReloadKey]);

  const handleRefunded = (updatedOrder) => {
    setTickets(tickets.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)));
  };

  if (loading) {
    return (
      <main className="page profile">
        <p className="text-body-m">Loading...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="page profile">
        <p className="text-body-m">Please log in to see your profile.</p>
      </main>
    );
  }

  const upcomingCount = tickets.filter(
    (order) => order.isUpcoming && order.status !== 'refunded'
  ).length;

  const tabClass = (name) => `profile__tab text-label-m ${tab === name ? 'profile__tab--active' : ''}`;

  return (
    <main className="page profile">
      <h1 className="profile__title text-h1">My Profile</h1>

      <div className="profile__tabs">
        <button type="button" className={tabClass('info')} onClick={() => setSearchParams({ tab: 'info' })}>
          Personal Information
        </button>
        <button
          type="button"
          className={tabClass('tickets')}
          onClick={() => setSearchParams({ tab: 'tickets' })}
        >
          My Tickets
          {upcomingCount > 0 && <span className="profile__count">{upcomingCount}</span>}
        </button>
      </div>

      {tab === 'info' ? (
        <>
          <ProfileStatus user={user} />
          <ProfileForm />
        </>
      ) : (
        <MyTickets
          tickets={tickets}
          loading={ticketsLoading}
          error={ticketsError}
          onRetry={() => setTicketsReloadKey(ticketsReloadKey + 1)}
          onRefunded={handleRefunded}
        />
      )}
    </main>
  );
}

export default Profile;