import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isLoggedIn, modal, openLogin, openRegister } = useAuth();

  return (
    <nav>
      <Link to="/">Kino XII</Link>
      <Link to="/sessions">Sessions</Link>

      {isLoggedIn ? (
        <span>Logged in</span>
      ) : (
        <>
          <button onClick={openLogin}>Log in</button>
          <button onClick={openRegister}>Sign up</button>
        </>
      )}

      <p>modal: {String(modal)}</p> {/* TEMP: delete later */}
    </nav>
  );
}

export default Navbar;