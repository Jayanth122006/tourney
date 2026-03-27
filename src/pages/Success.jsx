import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, Users } from 'lucide-react';
import useScrollReveal from '../utils/useScrollReveal';
import '../styles/forms.css';

const Success = () => {
  useScrollReveal();
  const location = useLocation();
  const squadData = location.state?.squadData;

  // Protect route if no data
  if (!squadData) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="app-wrapper animate-fade-in" style={{ padding: '80px 20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', borderRadius: '32px' }}>
          <div style={{ width: '80px', height: '80px', background: 'rgba(0, 230, 118, 0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', border: '1px solid var(--success)', boxShadow: '0 0 40px rgba(0, 230, 118, 0.2)' }}>
            <CheckCircle size={40} color="var(--success)" />
          </div>
          
          <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '15px' }}>Registration Successful</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '40px' }}>
            Your squad is successfully registered for the tournament.
          </p>

          <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '40px' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: '800', opacity: 0.4, textTransform: 'uppercase', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={16} color="var(--success)" /> Summary
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ opacity: 0.5 }}>Squad Name</span>
              <span style={{ fontWeight: '700' }}>{squadData.squadName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ opacity: 0.5 }}>Leader Name</span>
              <span>{squadData.leaderName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ opacity: 0.5 }}>Status</span>
              <span style={{ color: 'var(--success)', fontWeight: '800' }}>CONFIRMED</span>
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Matches commence this weekend. Check the Matches section for your fixtures.</p>
          </div>

          <Link to="/" className="btn btn-primary" style={{ width: '100%', height: '60px', borderRadius: '16px' }}>
            RETURN TO HOME PAGE
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;
