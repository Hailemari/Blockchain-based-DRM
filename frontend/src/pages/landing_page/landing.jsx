import { useRef, useState } from 'react';
import decentral from '../../assets/images/decentral.png';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const CoolButton = ({ onClick }) => {
  return (
    <Link to='/login'>
      <button className="cool-button" onClick={onClick}>
        Get Started Now
      </button>
    </Link>
  );
}

CoolButton.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

function Landing() {
  const serviceRef = useRef(null);
  const footerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavLinkClick = () => {
    setIsOpen(false);
    footerRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToService = () => {
    setIsOpen(false);
    serviceRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to='/' className="logo-text">BDRM</Link>
        </div>
        <div className={`navbar-menu ${isOpen ? 'open' : ''}`}>
          <ul className="navbar-links">
            <li><Link to="/home" onClick={toggleMenu}>Home</Link></li>
            <li><Link to="#about" onClick={handleNavLinkClick}>About</Link></li>
            <li><Link to="#services" onClick={scrollToService}>Services</Link></li>
            <li><Link to="#contact" onClick={handleNavLinkClick}>Contact</Link></li>
            <li><Link to="/login" onClick={toggleMenu}>Login</Link></li>
          </ul>
        </div>
        <div className="navbar-toggle" onClick={toggleMenu}>
          <div className={`bar ${isOpen ? 'open' : ''}`}></div>
          <div className={`bar ${isOpen ? 'open' : ''}`}></div>
          <div className={`bar ${isOpen ? 'open' : ''}`}></div>
        </div>
      </nav>

      <div className='hero-container'>
        <img src={decentral} alt="Blockchain illustration" className="hero-image" />
        <p className="hero-text">Protect your digital assets with blockchain!</p>
        <p className="hero-text">What are you waiting for?</p>
        <CoolButton />
      </div>

      <div className='services' ref={serviceRef}>
        <h1>What services BDRM offers to you?</h1>
        <h3>The system has many features from simple file upload to advanced blockchain technologies. <br />
          Including but not limited to:</h3>
        <ul>
          <li>Immutable record keeping!</li>
          <li>Decentralized Ownership Verification</li>
          <li>Smart Contract Automation</li>
          <li>Transparent Royalty Tracking</li>
          <li>Global Accessibility</li>
        </ul>
        <CoolButton />
      </div>

      <div className='the-system'>
        <h1>How the system really works</h1>
        <div className='system'>
          <img src={decentral} alt="How it works" className="system-image" />
          <div>
            <h3>You will follow these simple steps to use the system.</h3>
            <ul>
              <li>Step 1: Upload your digital content.</li>
              <li>Step 2: Register ownership on blockchain network.</li>
              <li>Step 3: Set rights and permissions.</li>
              <li>Step 4: Monitor usage and Royalty.</li>
            </ul>
          </div>
        </div>
        <CoolButton />
      </div>

      <footer className="footer" ref={footerRef}>
        <div className="footer-content">
          <div className="footer-column">
            <h3>About Us</h3>
            <p>Our goal is protecting the digital content of every individual in Ethiopia and abroad.</p>
          </div>
          <div className="footer-column">
            <h3>Services</h3>
            <ul>
              <li>Upload contents</li>
              <li>Use contents</li>
              <li>Manage contents</li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Contact Us</h3>
            <p>Email: contact-bdrm@bdrm.com</p>
            <p>Phone: +123456789</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 BDRM. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
