import { HashRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Character from './pages/Character';
import Raiding from './pages/Raiding';
import Achievements from './pages/Achievements';

export default function App() {
  return (
    <HashRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/character" element={<Character />} />
        <Route path="/raiding" element={<Raiding />} />
        <Route path="/achievements" element={<Achievements />} />
      </Routes>
      <Footer />
    </HashRouter>
  );
}
