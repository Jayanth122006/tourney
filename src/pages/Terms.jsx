import useScrollReveal from '../utils/useScrollReveal';
import '../styles/forms.css';

const Terms = () => {
  useScrollReveal();

  return (
    <div className="page-container">
      <div className="container form-wrapper animate-fade-in" style={{maxWidth: '800px'}}>
        <div className="form-header text-left">
          <h1 className="gradient-text">Tournament Rules & Terms</h1>
          <p>Please read these rules carefully before registering your squad.</p>
        </div>

        <div className="glass-panel" style={{padding: '30px', marginTop: '30px'}}>
          <div className="reveal delay-1">
            <h3 style={{color: 'var(--primary)', marginBottom: '10px'}}>1. General Rules</h3>
            <ul style={{listStyle: 'disc', paddingLeft: '20px', color: 'var(--text-muted)', marginBottom: '20px'}}>
              <li>All entry fees are strictly non-refundable under any circumstances.</li>
              <li>The organizer's decision is final and binding in all matters.</li>
              <li>Participants must be 16+ or have explicit guardian consent to participate.</li>
            </ul>
          </div>

          <div className="reveal delay-2">
            <h3 style={{color: 'var(--danger)', marginBottom: '10px'}}>2. Match Etiquette & Disqualification</h3>
            <ul style={{listStyle: 'disc', paddingLeft: '20px', color: 'var(--text-muted)', marginBottom: '20px'}}>
              <li>Use of any third-party cheats, hacks, or exploits will result in immediate and permanent disqualification.</li>
              <li>Entering the room with an incorrect or unregistered UID will result in a kick. Wrong UIDs are not our responsibility.</li>
              <li>Match timings must be strictly followed. Failure to join the room on time (No-show) results in immediate elimination.</li>
              <li>Internet issues, high ping, or device failures during the match are solely the player's responsibility. Matches will not be remade.</li>
            </ul>
          </div>

          <div className="reveal delay-3">
            <h3 style={{color: 'var(--accent)', marginBottom: '10px'}}>3. Prizes & Disclaimers</h3>
            <ul style={{listStyle: 'disc', paddingLeft: '20px', color: 'var(--text-muted)'}}>
              <li>The final prize pool will be officially announced after registration closes and is completely dependent on the total number of participating squads.</li>
              <li>Prize distribution rules will be shared on our official community channels.</li>
              <li>This tournament is an independent community event and is not affiliated with, authorized, or sponsored by Garena Free Fire.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
