import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Sessions from './pages/Sessions';
import Profile from './pages/Profile';
import LoginModal from './modals/LoginModal';
import RegisterModal from './modals/RegisterModal';
import MovieDetails from './pages/MovieDetails';

function App() {
  const { modal } = useAuth();

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/movies/:slug" element={<MovieDetails />} />
      </Routes>

      <Footer />

      {modal === 'login' && <LoginModal />}
      {modal === 'register' && <RegisterModal />}
    </>
  );
}

export default App;