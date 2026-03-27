import { Link, useLocation } from 'react-router-dom';
import { Gamepad2, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Rules', path: '/#rules' },
    { name: 'Join Us', path: '/join' },
    { name: 'Support', path: '/support' },
  ];

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="nav-logo">
          <Gamepad2 className="logo-icon" size={32} />
          <span className="logo-text gradient-text">FF Tourney</span>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-links desktop-only">
          {navLinks.map((link) => (
            link.path.startsWith('/#') ? (
              <a
                key={link.name}
                href={link.path}
                className="nav-link"
                onClick={(e) => {
                  if(window.location.pathname === '/') {
                    e.preventDefault();
                    document.getElementById(link.path.replace('/#', ''))?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.name}
              </Link>
            )
          ))}
          <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mobile-menu animate-fade-in">
          {navLinks.map((link) => (
            link.path.startsWith('/#') ? (
              <a
                key={link.name}
                href={link.path}
                className="mobile-link"
                onClick={(e) => {
                  setIsOpen(false);
                  if(window.location.pathname === '/') {
                    e.preventDefault();
                    document.getElementById(link.path.replace('/#', ''))?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.path}
                className="mobile-link"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            )
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
