import { useEffect } from 'react';
import closeIcon from '../assets/icons/close.svg';
import './Modal.css';

function Modal({ title, subtitle, onClose, className = '', children }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal ${className}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal__header">
          <div className="modal__titles">
            <h2 className="text-h2">{title}</h2>
            {subtitle && <p className="modal__subtitle text-body-s">{subtitle}</p>}
          </div>
          <button className="modal__close" onClick={onClose} aria-label="Close">
            <img src={closeIcon} alt="" width="24" height="24" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

export default Modal;