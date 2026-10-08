import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchBox from './SearchBox';
import chevronIcon from '../assets/icons/chevron-down.svg';
import ticketIcon from '../assets/icons/ticket.svg';
import './Navbar.css';

const getInitials = (name) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');

function Avatar({ user, name }) {
  return (
    <span className="navbar__avatar text-label-s">
      {user.avatar ? <img src={user.avatar} alt="" /> : getInitials(name)}
      <span className={`navbar__dot ${user.profileComplete ? 'navbar__dot--complete' : ''}`} />
    </span>
  );
}

function Navbar() {
  const { user, isLoggedIn, openLogin, openRegister, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const fullName = user?.fullName || user?.username || '';
  const firstName = fullName.split(' ')[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    closeMenu();
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
        <SearchBox />

        {isLoggedIn ? (
          <div className="navbar__profile" ref={menuRef}>
            <button className="navbar__profile-btn" onClick={() => setMenuOpen(!menuOpen)}>
              <Avatar user={user} name={fullName} />
              <span className="text-label-m">{firstName}</span>
              <img src={chevronIcon} alt="" width="16" height="16" className="navbar__chevron" />
            </button>

            {menuOpen && (
              <div className="navbar__menu">
                <div className="navbar__menu-user">
                  <Avatar user={user} name={fullName} />
                  <div>
                    <p className="text-label-m">{fullName}</p>
                    <p className="navbar__muted text-body-s">{user.email}</p>
                  </div>
                </div>

                {user.profileComplete ? (
                  <p className="navbar__status navbar__status--complete text-label-m">
                    Profile Complete ✓
                  </p>
                ) : (
                  <div className="navbar__status navbar__status--incomplete">
                    <p className="text-label-m">Profile incomplete</p>
                    <p className="navbar__muted text-body-s">
                      Please complete your profile to enable booking
                    </p>
                  </div>
                )}

                <Link to="/profile" className="navbar__menu-link text-label-m" onClick={closeMenu}>
                  My Profile
                </Link>
                <Link
                  to="/profile?tab=tickets"
                  className="navbar__menu-link text-label-m"
                  onClick={closeMenu}
                >
                  <img src={ticketIcon} alt="" width="16" height="16" />
                  My Tickets
                </Link>

                <button type="button" className="navbar__logout text-label-m" onClick={handleLogout}>
                  Log out
                </button>
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