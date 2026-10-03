import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Sessions from './pages/Sessions';
import Profile from './pages/Profile';
import LoginModal from './modals/LoginModal';
import RegisterModal from './modals/RegisterModal';
import Footer from './components/Footer';

function App() {
  const { modal } = useAuth();

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

<footer />
      {modal === 'login' && <LoginModal />}
      {modal === 'register' && <RegisterModal />}
    </>
  );
}

export default App;