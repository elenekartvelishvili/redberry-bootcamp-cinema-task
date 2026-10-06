import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';
import ProfileForm from '../components/ProfileForm';

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

            {tab === 'info' ? <ProfileForm /> : <p>Tickets come later</p>}
    </main>
  );
}

export default Profile;