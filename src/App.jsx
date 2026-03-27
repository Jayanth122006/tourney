import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Registration from './pages/Registration';
import Payment from './pages/Payment';
import Success from './pages/Success';
import Support from './pages/Support';
import JoinUs from './pages/JoinUs';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Adam from './pages/Adam';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="app-wrapper">
        <div className="bg-glow glow-1"></div>
        <div className="bg-glow glow-2"></div>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/success" element={<Success />} />
            <Route path="/support" element={<Support />} />
            <Route path="/join" element={<JoinUs />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/adam" element={<Adam />} />
            <Route path="/admin" element={<Navigate to="/adam" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
