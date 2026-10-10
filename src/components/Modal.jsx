import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import closeIcon from '../assets/icons/close.svg';
import './Modal.css';

function Modal({ title, subtitle, headerExtra, onClose, className = '', children }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return createPortal(
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
          <div className="modal__header-right">
            {headerExtra}
            <button className="modal__close" onClick={onClose} aria-label="Close">
              <img src={closeIcon} alt="" width="24" height="24" />
            </button>
          </div>
        </div>

        {children}
      </div>
    </div>,
    document.body
  );
}

export default Modal;
