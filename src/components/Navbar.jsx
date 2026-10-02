import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, isLoggedIn, openLogin, openRegister, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
  };

  return (
    <nav>
      <Link to="/">Kino XII</Link>
      <Link to="/sessions">Sessions</Link>

      {isLoggedIn ? (
        <div>
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {user.avatar ? (
              <img src={user.avatar} alt="avatar" width="32" height="32" />
            ) : (
              <span>{user.username[0].toUpperCase()}</span>
            )}
            <span>{user.profileComplete ? '🟢' : '🟡'}</span>
          </button>

          {menuOpen && (
            <div>
              <Link to="/profile" onClick={() => setMenuOpen(false)}>
                My Profile
              </Link>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      ) : (
        <>
          <button onClick={openLogin}>Log in</button>
          <button onClick={openRegister}>Sign up</button>
        </>
      )}
    </nav>
  );
}

export default Navbar;