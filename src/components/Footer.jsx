import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__line" />
      <div className="footer__row">
        <Link to="/" className="footer__logo text-button">
          <span>KINO</span>
          <span className="footer__logo-accent">XII</span>
        </Link>
        <p className="footer__copy text-body-s">
          © {new Date().getFullYear()} Kino XII. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;