import { Camera, MessageSquare, Mail } from 'lucide-react';
import '../styles/forms.css'; // Reusing form styles for container
import useScrollReveal from '../utils/useScrollReveal';

const JoinUs = () => {
  useScrollReveal();

  return (
    <div className="page-container">
      <div className="container form-wrapper animate-fade-in">
        <div className="form-header">
          <h1 className="gradient-text">Join Our Community</h1>
          <p>Connect with other players, find squads, and stay updated!</p>
        </div>

        <div className="rules-grid" style={{ marginTop: '40px' }}>
          <a href="https://discord.gg/yQzWZXHY" target="_blank" rel="noopener noreferrer" className="rule-card glass-panel reveal" style={{textDecoration: 'none', alignItems: 'center', textAlign: 'center'}}>
            <div className="rule-icon info" style={{ color: '#5865F2', marginBottom: '20px' }}>
              <MessageSquare size={48} />
            </div>
            <h3 style={{ margin: '0 0 10px 0' }}>Discord Server</h3>
            <p>Join our official Discord to find teammates, chat with admins, and get immediate match updates.</p>
            <div className="btn btn-outline btn-sm mt-4 w-100" style={{borderColor: '#5865F2', color: '#5865F2'}}>Join Discord</div>
          </a>

          <a href="https://instagram.com/tourneygames_" target="_blank" rel="noopener noreferrer" className="rule-card glass-panel reveal delay-1" style={{textDecoration: 'none', alignItems: 'center', textAlign: 'center'}}>
            <div className="rule-icon danger" style={{ color: '#E1306C', marginBottom: '20px' }}>
              <Camera size={48} />
            </div>
            <h3 style={{ margin: '0 0 10px 0' }}>Instagram</h3>
            <p>Follow us for tournament highlights, featured plays, and upcoming registration dates.</p>
            <div className="btn btn-outline btn-sm mt-4 w-100" style={{borderColor: '#E1306C', color: '#E1306C'}}>Follow @tourneygames_</div>
          </a>

          <a href="mailto:tourneygames1@gmail.com" className="rule-card glass-panel reveal delay-2" style={{textDecoration: 'none', alignItems: 'center', textAlign: 'center'}}>
            <div className="rule-icon primary" style={{ color: '#00e676', marginBottom: '20px' }}>
              <Mail size={48} />
            </div>
            <h3 style={{ margin: '0 0 10px 0' }}>Email Us</h3>
            <p>For direct inquiries, sponsorships, or official tournament support, drop us an email.</p>
            <div className="btn btn-outline btn-sm mt-4 w-100" style={{borderColor: '#00e676', color: '#00e676'}}>tourneygames1@gmail.com</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default JoinUs;
