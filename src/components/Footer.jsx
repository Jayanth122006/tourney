import { Gamepad2, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <Gamepad2 className="logo-icon" size={24} />
            <span className="logo-text gradient-text">Tourney</span>
          </div>
          <p className="footer-text">
            Compete with the best. Fair play and pure skills.
          </p>
          <div className="footer-bottom" style={{flexDirection: 'column', gap: '15px', padding: '30px 0 20px'}}>
            <p>&copy; {new Date().getFullYear()} Tourney. All rights reserved.</p>
            
            <div className="footer-legal-links" style={{display: 'flex', gap: '24px', fontSize: '0.85rem'}}>
              <Link to="/terms" style={{color: 'var(--text-muted)'}}>Terms & Rules</Link>
              <Link to="/privacy" style={{color: 'var(--text-muted)'}}>Privacy Policy</Link>
            </div>
            
            <p style={{fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)', marginTop: '5px', textAlign: 'center'}}>
              This tournament is an independent community event and is not affiliated with or sponsored by Garena Free Fire.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
