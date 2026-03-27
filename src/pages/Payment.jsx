import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { CreditCard, ShieldCheck } from 'lucide-react';
import useScrollReveal from '../utils/useScrollReveal';
import '../styles/forms.css';

const Payment = () => {
  useScrollReveal();
  const location = useLocation();
  const navigate = useNavigate();
  const squadData = location.state?.squadData;

  if (!squadData) {
    return <Navigate to="/register" replace />;
  }

  const handlePayment = () => {
    setTimeout(() => {
      navigate('/success', { state: { squadData } });
    }, 1500);
  };

  return (
    <div className="app-wrapper animate-fade-in" style={{ padding: '80px 20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '15px' }}>Registration Fee</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Complete your transaction to secure your tournament slot.</p>
        </div>

        <div className="glass-panel" style={{ padding: '50px', borderRadius: '32px' }}>
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ShieldCheck size={20} color="var(--success)" /> Summary
            </h3>
            
            <div style={{ display: 'grid', gap: '15px', background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '800', opacity: 0.4, textTransform: 'uppercase' }}>Squad Name</span>
                <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)' }}>{squadData.squadName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '800', opacity: 0.4, textTransform: 'uppercase' }}>Squad Leader</span>
                <span style={{ color: 'var(--text-muted)' }}>{squadData.leaderName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '800', opacity: 0.4, textTransform: 'uppercase' }}>Contact Number</span>
                <span style={{ color: 'var(--text-muted)' }}>{squadData.phone}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '800', opacity: 0.6 }}>ENTRY FEE</span>
                <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>₹100</span>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '25px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '800', opacity: 0.5 }}>
              Secure Payment Gateway: <span style={{ color: 'var(--success)' }}>Active</span>
            </p>
            <button onClick={handlePayment} className="btn btn-primary" style={{ width: '100%', height: '65px', borderRadius: '18px', fontSize: '1.1rem' }}>
              <CreditCard size={20} style={{ marginRight: '12px', verticalAlign: 'middle' }} /> 
              COMPLETE TRANSACTION
            </button>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '20px', lineHeight: '1.6', opacity: 0.5 }}>
              By clicking complete, you agree to the non-refundable registration policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
