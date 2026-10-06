import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';
import ProfileForm from '../components/ProfileForm';


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
  const [tab, setTab] = useState('info');

  useEffect(() => {
    if (!loading && !user) openLogin();
  }, [loading, user, openLogin]);

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

  const tabClass = (name) => `profile__tab text-label-m ${tab === name ? 'profile__tab--active' : ''}`;

  return (
    <main className="page profile">
      <h1 className="profile__title text-h1">My Profile</h1>

      <div className="profile__tabs">
        <button type="button" className={tabClass('info')} onClick={() => setTab('info')}>
          Personal Information
        </button>
        <button type="button" className={tabClass('tickets')} onClick={() => setTab('tickets')}>
          My Tickets
        </button>
      </div>
      {tab === 'info' ? (
        <>
          <ProfileStatus user={user} />
          <ProfileForm />
        </>
      ) : (
        <p>Tickets come later</p>
      )}
    </main>
  );
}

export default Profile;