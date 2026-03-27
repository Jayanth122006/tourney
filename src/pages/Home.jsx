import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Trophy, Users, Zap, AlertTriangle, Clock } from 'lucide-react';
import useScrollReveal from '../utils/useScrollReveal';
import '../styles/home.css';

const Home = () => {
  useScrollReveal();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8081/api/settings/registration_open')
      .then(res => res.json())
      .then(data => setIsOpen(data.value === 'true'))
      .catch(() => setIsOpen(true));
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content animate-fade-in">
          <div className="badge delay-1">
            <span className={isOpen ? "silver-pulse" : "red-pulse"}></span>
            {isOpen ? "Registration Open" : "Registration Closed"}
          </div>
          <h1 className="hero-title neon-text delay-2">
            FREE FIRE <br />
            <span className="gradient-text">TOURNAMENT</span>
          </h1>
          <p className="hero-subtitle delay-3">
            Register your squad and compete against the best to win huge cash prizes. 
            Prove your skills in the ultimate battleground.
          </p>
          
          <div className="hero-actions delay-3">
            {isOpen ? (
              <Link to="/register" className="btn btn-primary btn-lg">
                Register Now - ₹100
              </Link>
            ) : (
              <button className="btn btn-outline btn-lg" disabled style={{opacity: 0.8, cursor: 'not_allowed'}}>
                <Clock size={18} style={{marginRight: '10px'}} /> Registration Closed
              </button>
            )}
            <a href="#rules" className="btn btn-outline btn-lg">
              View Rules
            </a>
          </div>
          
          <div className="hero-stats delay-3">
            <div className="stat-item">
              <span className="stat-value">4v4</span>
              <span className="stat-label">Clash Squad Mode</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">Dynamic</span>
              <span className="stat-label">Prize Pool (Based on Entries)</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">Sat/Sun</span>
              <span className="stat-label">Match Days</span>
            </div>
          </div>
        </div>
        
        {/* Abstract background elements */}
        <div className="bg-glow glow-1"></div>
        <div className="bg-glow glow-2"></div>
      </section>

      {/* Rules Section */}
      <section id="rules" className="rules-section reveal">
        <div className="container">
          <h2 className="section-title"><span className="gradient-text">Tournament Rules</span></h2>
          
          <div className="rules-grid">
            <div className="rule-card glass-panel">
              <div className="rule-icon danger"><AlertTriangle size={32} /></div>
              <h3>Strictly Prohibited</h3>
              <p>Panels, hacks, and custom APKs are strictly NOT allowed. If found, the squad will be disqualified, removed immediately without refund, and banned permanently.</p>
            </div>
            
            <div className="rule-card glass-panel">
              <div className="rule-icon warning"><ShieldAlert size={32} /></div>
              <h3>Level Requirements</h3>
              <p>Minimum player account level required is <strong>Level 40+</strong>. Accounts below this level will not be permitted to enter the custom room.</p>
            </div>
            
            <div className="rule-card glass-panel">
              <div className="rule-icon success"><Zap size={32} /></div>
              <h3>Record Your Gameplay</h3>
              <p>Every player must record/save their gameplay. This acts as proof if any appeal or cheating allegation is raised. Admins will also spectate matches.</p>
            </div>

            <div className="rule-card glass-panel">
              <div className="rule-icon primary"><Trophy size={32} /></div>
              <h3>Match Details</h3>
              <p>Matches will be held strictly on <strong>Saturday and Sunday</strong>. Registrations remain open from Monday to Thursday until slots are filled.</p>
            </div>
            
            <div className="rule-card glass-panel">
              <div className="rule-icon info"><Users size={32} /></div>
              <h3>Registered Accounts Only</h3>
              <p>Players must enter the room with the exact same Game UIDs provided during registration. Substitutes are not allowed without prior notice.</p>
            </div>
            
            <div className="rule-card glass-panel">
              <div className="rule-icon danger"><AlertTriangle size={32} /></div>
              <h3>No Refunds</h3>
              <p>Once registered, withdrawing from the tournament is not allowed. Entry fees are non-refundable under any circumstances.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section reveal">
        <div className="container">
          <div className="glass-panel cta-panel" style={{textAlign: 'center'}}>
            <h2>{isOpen ? "Ready to Dominate?" : "Tournament Full"}</h2>
            <p>{isOpen ? "Slots fill up fast. Secure your team's spot today." : "Registrations are currently closed. Follow our socials for the next season!"}</p>
            {isOpen ? (
              <Link to="/register" className="btn btn-primary btn-lg mt-4">
                Register Your Squad (₹100)
              </Link>
            ) : (
              <button className="btn btn-outline btn-lg mt-4" disabled>
                Next Season Coming Soon
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
