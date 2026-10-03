import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import searchIcon from '../assets/icons/search.svg';
import chevronIcon from '../assets/icons/chevron-down.svg';
import './Navbar.css';

const getInitials = (name) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');

function Navbar() {
  const { user, isLoggedIn, openLogin, openRegister, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const fullName = user?.fullName || user?.username || '';
  const firstName = fullName.split(' ')[0];

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar__left">
        <Link to="/" className="navbar__logo text-h2">
          <span>KINO</span>
          <span className="navbar__logo-accent">XII</span>
        </Link>
        <Link to="/sessions" className="navbar__link">
          Sessions
        </Link>
      </div>

      <div className="navbar__right">
        <label className="navbar__search">
          <img src={searchIcon} alt="" width="14" height="14" />
          <input type="search" placeholder="Search films and live events" className="text-body-m" />
        </label>

        {isLoggedIn ? (
          <div className="navbar__profile">
            <button className="navbar__profile-btn" onClick={() => setMenuOpen(!menuOpen)}>
              <span className="navbar__avatar text-label-s">
                {user.avatar ? <img src={user.avatar} alt="" /> : getInitials(fullName)}
                <span
                  className={`navbar__dot ${user.profileComplete ? 'navbar__dot--complete' : ''}`}
                />
              </span>
              <span className="text-label-m">{firstName}</span>
              <img src={chevronIcon} alt="" width="16" height="16" className="navbar__chevron" />
            </button>

            {menuOpen && (
              <div className="navbar__menu text-label-m">
                <Link to="/profile" onClick={() => setMenuOpen(false)}>
                  My Profile
                </Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <div className="navbar__auth">
            <button className="btn btn--red text-button" onClick={openRegister}>
              Sign up
            </button>
            <button className="btn btn--white text-button" onClick={openLogin}>
              Log in
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;