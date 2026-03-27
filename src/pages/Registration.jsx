import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, Phone, Mail, User, Shield, AlertCircle, Loader2 } from 'lucide-react';
import useScrollReveal from '../utils/useScrollReveal';
import '../styles/forms.css';

const Registration = () => {
  useScrollReveal();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    squadName: '',
    leaderName: '',
    phone: '',
    email: '',
    p1Name: '', p1Uid: '',
    p2Name: '', p2Uid: '',
    p3Name: '', p3Uid: '',
    p4Name: '', p4Uid: '',
    p5Name: '', p5Uid: '' 
  });
  
  const [errors, setErrors] = useState({});
  const [confirmUids, setConfirmUids] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('http://localhost:8081/api/admin/registration-status');
        if (res.ok) {
          const data = await res.json();
          setIsRegistrationOpen(data.status === 'true');
        }
      } catch (err) {
        console.error('Status check failed:', err);
      } finally {
        setCheckingStatus(false);
      }
    };
    checkStatus();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.squadName.trim()) newErrors.squadName = 'Squad Name is required';
    if (!formData.leaderName.trim()) newErrors.leaderName = 'Leader Name is required';
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Valid 10-digit phone number required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
    
    // Required players 1-4
    [1, 2, 3, 4].forEach(num => {
      if (!formData[`p${num}Name`]?.trim()) newErrors[`p${num}Name`] = 'Name required';
      if (!formData[`p${num}Uid`]?.trim()) newErrors[`p${num}Uid`] = 'UID required';
    });
    
    const uids = [formData.p1Uid, formData.p2Uid, formData.p3Uid, formData.p4Uid];
    if (formData.p5Uid?.trim()) uids.push(formData.p5Uid);
    const uniqueUids = new Set(uids.filter(u => u?.trim()));
    if (uniqueUids.size !== uids.filter(u => u?.trim()).length) {
      newErrors.duplicateUids = 'Duplicate ID detected.';
    }

    if (!confirmUids) newErrors.confirmUids = 'Required';
    if (!agreeTerms) newErrors.agreeTerms = 'Required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      const payload = {
        squadName: formData.squadName,
        leaderName: formData.leaderName,
        phone: formData.phone,
        email: formData.email,
        p1Name: formData.p1Name, p1Uid: formData.p1Uid,
        p2Name: formData.p2Name, p2Uid: formData.p2Uid,
        p3Name: formData.p3Name, p3Uid: formData.p3Uid,
        p4Name: formData.p4Name, p4Uid: formData.p4Uid,
        p5Name: formData.p5Name, p5Uid: formData.p5Uid
      };

      try {
        const response = await fetch("http://localhost:8081/api/squads/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Registration failed');
        }

        navigate('/payment', { state: { squadData: data } });

      } catch (error) {
        // Professional Error Feedback for Duplicates/Full
        setErrors({ ...errors, submission: error.message });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="app-wrapper animate-fade-in" style={{ padding: '80px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '15px' }}>Tournament Registration</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Register your team. Entry Fee: <strong>₹100</strong></p>
          
          {errors.submission && (
            <div className="animate-shake" style={{ marginTop: '30px', padding: '20px', background: 'rgba(255, 71, 87, 0.1)', border: '1px solid var(--danger)', borderRadius: '16px', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'center' }}>
              <AlertCircle size={20} />
              <span style={{ fontWeight: '700' }}>{errors.submission}</span>
            </div>
          )}
        </div>

        { !isRegistrationOpen ? (
          <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', borderRadius: '32px' }}>
            <AlertCircle size={64} color="var(--danger)" style={{ marginBottom: '20px', display: 'inline-block' }} />
            <h1 className="gradient-text">Registration Closed</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6', maxWidth: '500px', margin: '0 auto 30px' }}>
              The organizers have closed registrations for the current tournament. Please check back later or contact support.
            </p>
            <Link to="/" className="btn btn-outline" style={{ display: 'inline-block' }}>Back to Home</Link>
          </div>
        ) : (

        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '50px', borderRadius: '32px' }}>
          <div style={{ marginBottom: '50px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Users size={20} color="var(--primary)" /> Team Details
            </h3>
            
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Squad Name</label>
              <input 
                type="text" 
                name="squadName" 
                value={formData.squadName} 
                onChange={handleChange}
                placeholder="Enter your squad name"
                className="form-input"
                style={{ border: errors.squadName ? '1px solid var(--danger)' : '' }}
              />
              {errors.squadName && <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '8px', display: 'block' }}>{errors.squadName}</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Leader Name</label>
                <input 
                  type="text" 
                  name="leaderName" 
                  value={formData.leaderName} 
                  onChange={handleChange}
                  placeholder="In-game Name"
                  className="form-input"
                  style={{ border: errors.leaderName ? '1px solid var(--danger)' : '' }}
                />
                {errors.leaderName && <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '8px', display: 'block' }}>{errors.leaderName}</span>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setFormData({...formData, phone: val});
                    if (errors.phone) setErrors({...errors, phone: null});
                  }}
                  placeholder="10-digit mobile"
                  className="form-input"
                  maxLength="10"
                  style={{ border: errors.phone ? '1px solid var(--danger)' : '' }}
                />
                {errors.phone && <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '8px', display: 'block' }}>{errors.phone}</span>}
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange}
                placeholder="your@field.com"
                className="form-input"
                style={{ border: errors.email ? '1px solid var(--danger)' : '' }}
              />
              {errors.email && <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '8px', display: 'block' }}>{errors.email}</span>}
            </div>
          </div>          <div style={{ marginBottom: '50px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Shield size={20} color="var(--accent)" /> Player Details
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '25px', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', borderLeft: '4px solid #ff9f43', color: '#ff9f43' }}>
                <strong>Important:</strong> Exact Free Fire UIDs are required. Any mismatch may result in disqualification. Players must be Level 40+.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '20px', marginBottom: '20px' }}>
              {[1, 2, 3, 4].map(num => (
                <div key={num} style={{ background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--surface-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>{num}</div>
                      Player {num} {num === 1 && <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '800', padding: '2px 8px', background: 'rgba(0,242,254,0.1)', borderRadius: '6px', marginLeft: 'auto' }}>LEADER</span>}
                  </h4>
                  <div style={{ display: 'grid', gap: '15px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>In-game Name</label>
                      <input type="text" name={`p${num}Name`} value={formData[`p${num}Name`]} onChange={handleChange} placeholder={`Player ${num} IGN`} className="form-input" style={{ width: '100%', border: errors[`p${num}Name`] ? '1px solid var(--danger)' : '' }} />
                      {errors[`p${num}Name`] && <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '6px' }}>{errors[`p${num}Name`]}</div>}
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Player UID</label>
                      <input type="text" name={`p${num}Uid`} value={formData[`p${num}Uid`]} onChange={handleChange} placeholder={`Player ${num} UID`} className="form-input" style={{ width: '100%', border: errors[`p${num}Uid`] ? '1px solid var(--danger)' : '' }} />
                      {errors[`p${num}Uid`] && <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '6px' }}>{errors[`p${num}Uid`]}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '20px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--surface-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>5</div>
                    Substitute <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '800', padding: '2px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', marginLeft: 'auto' }}>OPTIONAL</span>
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>In-game Name</label>
                    <input type="text" name="p5Name" value={formData.p5Name} onChange={handleChange} placeholder="Sub IGN (Optional)" className="form-input" style={{ width: '100%', border: errors.p5Name ? '1px solid var(--danger)' : '' }} />
                    {errors.p5Name && <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '6px' }}>{errors.p5Name}</div>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Player UID</label>
                    <input type="text" name="p5Uid" value={formData.p5Uid} onChange={handleChange} placeholder="Sub UID (Optional)" className="form-input" style={{ width: '100%', border: errors.p5Uid ? '1px solid var(--danger)' : '' }} />
                    {errors.p5Uid && <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '6px' }}>{errors.p5Uid}</div>}
                  </div>
                </div>
            </div>
          </div>

          <div style={{ marginBottom: '40px' }}>
            {errors.duplicateUids && <div style={{ color: 'var(--danger)', fontSize: '0.9rem', padding: '15px', background: 'rgba(255, 71, 87, 0.05)', borderRadius: '12px', border: '1px solid rgba(255, 71, 87, 0.1)', marginBottom: '20px' }}>{errors.duplicateUids}</div>}
            
            <div style={{ marginBottom: '35px', padding: '25px', background: 'rgba(0,0,0,0.2)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', gap: '15px', marginBottom: '20px' }}>
              <input 
                type="checkbox" 
                checked={confirmUids} 
                onChange={(e) => setConfirmUids(e.target.checked)}
                style={{ marginTop: '5px', width: '24px', height: '24px', accentColor: 'var(--primary)', flexShrink: 0 }}
              />
              <span style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                All identities are verified. I understand that incorrect UIDs will lead to disqualification.
              </span>
            </label>
            {errors.confirmUids && <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '-15px', marginBottom: '20px', marginLeft: '40px' }}>{errors.confirmUids}</div>}

            <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', gap: '15px' }}>
              <input 
                type="checkbox" 
                checked={agreeTerms} 
                onChange={(e) => setAgreeTerms(e.target.checked)}
                style={{ marginTop: '5px', width: '24px', height: '24px', accentColor: 'var(--primary)', flexShrink: 0 }}
              />
              <span style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                I agree to the <Link to="/terms" style={{ color: 'var(--accent)' }}>Terms & Conditions</Link>. Entry fees are final and non-refundable.
              </span>
            </label>
            {errors.agreeTerms && <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '10px', marginLeft: '40px' }}>{errors.agreeTerms}</div>}
          </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '65px', borderRadius: '18px', fontSize: '1.1rem' }} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : 'PROCEED TO PAYMENT'}
          </button>
        </form>
        )}
      </div>
    </div>
  );
};

export default Registration;
