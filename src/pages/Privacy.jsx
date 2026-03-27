import useScrollReveal from '../utils/useScrollReveal';
import '../styles/forms.css';

const Privacy = () => {
  useScrollReveal();

  return (
    <div className="page-container">
      <div className="container form-wrapper animate-fade-in" style={{maxWidth: '800px'}}>
        <div className="form-header text-left">
          <h1 className="gradient-text">Privacy Policy</h1>
          <p>How we handle your registration data.</p>
        </div>

        <div className="glass-panel" style={{padding: '30px', marginTop: '30px'}}>
          <div className="reveal delay-1">
            <h3 style={{color: 'var(--primary)', marginBottom: '10px'}}>1. Data Collection</h3>
            <p style={{color: 'var(--text-muted)', marginBottom: '20px'}}>
              During registration, we collect your squad name, leader name, mobile number, email address, and in-game UIDs.
            </p>
          </div>

          <div className="reveal delay-2">
            <h3 style={{color: 'var(--accent)', marginBottom: '10px'}}>2. How We Use Your Data</h3>
            <p style={{color: 'var(--text-muted)', marginBottom: '10px'}}>
              We collect user information <strong>strictly for tournament communication</strong> (e.g., sending match schedules, room IDs, passwords, and prize distribution).
            </p>
            <p style={{color: 'var(--text-muted)', marginBottom: '20px'}}>
              We firmly respect your privacy and <strong>do not sell, rent, or share</strong> your personal contact data (emails or phone numbers) with any third parties or marketing companies.
            </p>
          </div>

          <div className="reveal delay-3">
            <h3 style={{color: 'var(--danger)', marginBottom: '10px'}}>3. Public Information</h3>
            <p style={{color: 'var(--text-muted)'}}>
              Your Squad Name and In-Game UIDs may be displayed publicly on tournament brackets, leaderboards, and live streams to ensure tournament transparency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
