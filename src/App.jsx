import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Modal from './components/Modal';
import Home from './pages/Home';
import Sessions from './pages/Sessions';
import Profile from './pages/Profile';
import LoginModal from './components/LoginModal';

function App() {
  const { modal, closeModal } = useAuth();

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      {modal === 'login' && <LoginModal />}

      {modal === 'register' && (
        <Modal title="Sign up" onClose={closeModal}>
          <p>register form goes here</p>
        </Modal>
      )}
    </>
  );
}

export default App;