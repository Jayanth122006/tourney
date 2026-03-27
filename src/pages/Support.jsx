import { useState } from 'react';
import { MessageSquare, Phone, Mail, FileText, Loader2 } from 'lucide-react';
import useScrollReveal from '../utils/useScrollReveal';
import '../styles/forms.css';

const Support = () => {
  useScrollReveal();
  const [formData, setFormData] = useState({
    squadName: '',
    mobileNumber: '',
    email: '',
    issue: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const supportData = {
      squadName: formData.squadName,
      phone: formData.mobileNumber,
      email: formData.email,
      message: formData.issue
    };

    try {
      const response = await fetch("http://localhost:8081/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supportData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit query');
      }

      setSubmitted(true);
      
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-wrapper animate-fade-in" style={{ padding: '80px 20px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '15px' }}>Support Request</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Submit your issue to the tournament administrators.</p>
        </div>

        {submitted ? (
          <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', borderRadius: '32px' }}>
            <div style={{ width: '80px', height: '80px', background: 'rgba(0, 242, 254, 0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', border: '1px solid var(--accent)' }}>
              <MessageSquare size={40} color="var(--accent)" />
            </div>
            <h2 className="gradient-text" style={{ fontSize: '1.8rem', marginBottom: '15px' }}>Query Submitted</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '40px' }}>
              We have received your support request for squad <strong>{formData.squadName}</strong>.
              An administrator will review your query and contact you shortly.
            </p>
            <button 
              className="btn btn-primary"
              style={{ width: '100%', height: '60px', borderRadius: '16px' }}
              onClick={() => {
                setSubmitted(false);
                setFormData({squadName: '', mobileNumber: '', email: '', issue: ''});
              }}
            >
              Raise New Query
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '50px', borderRadius: '32px' }}>
            <div style={{ marginBottom: '40px' }}>
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', opacity: 0.5, textTransform: 'uppercase', marginBottom: '12px' }}>Squad Name</label>
                <input type="text" name="squadName" value={formData.squadName} onChange={handleChange} required placeholder="Enter registered squad name" className="form-input"/>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '20px', marginBottom: '25px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', opacity: 0.5, textTransform: 'uppercase', marginBottom: '12px' }}>Phone Number</label>
                  <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required placeholder="10-digit number" className="form-input"/>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', opacity: 0.5, textTransform: 'uppercase', marginBottom: '12px' }}>Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Contact email" className="form-input"/>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', opacity: 0.5, textTransform: 'uppercase', marginBottom: '12px' }}>Describe Your Issue</label>
                <textarea 
                  name="issue" 
                  value={formData.issue} 
                  onChange={handleChange} 
                  required 
                  placeholder="Provide detailed information about your issue..." 
                  style={{ width: '100%', padding: '15px 20px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#fff', fontSize: '1rem', minHeight: '150px', outline: 'none', resize: 'vertical' }}
                ></textarea>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '65px', borderRadius: '18px', fontSize: '1.1rem' }} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : 'Submit Support Ticket'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Support;
