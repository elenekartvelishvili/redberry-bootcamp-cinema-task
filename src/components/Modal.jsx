function Modal({ title, onClose, children }) {
  return (
    <div onClick={onClose} style={overlayStyle}>
      <div onClick={(e) => e.stopPropagation()} style={boxStyle}>
        <button onClick={onClose}>X</button>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}

// TEMPORARY inline styles, so we can see it. Real styling comes later with Figma.
const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const boxStyle = {
  background: 'white',
  color: 'black',
  padding: '24px',
  minWidth: '320px',
};

export default Modal;