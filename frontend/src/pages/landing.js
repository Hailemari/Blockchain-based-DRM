import React, {useRef} from 'react';
import bgvideo from './videos/cover-vedio.mp4';
import './landing.css';
import './navbar.css';
import { useState } from 'react';
import decentral from './videos/decentral.png'
import {Link} from 'react-router-dom';

const CoolButton = ({ text, onClick }) => {
  return (
    <Link to='/login'><button className="cool-button" onClick={onClick}>
     get started now
    </button>
    </Link>
  );
}



function Landing() {

    const serviceRef = useRef(null);
    const footerRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleMenu = () => {
      setIsOpen(!isOpen);
    };

    const handleNavLinkClick = () => {
      // Close the navbar menu when a link is clicked
      setIsOpen(false);
      // Scroll to the footer
      footerRef.current.scrollIntoView({ behavior: 'smooth' });
    };
    const scrollToService = () => {
      // Close the navbar menu when a link is clicked
      setIsOpen(false);
      // Scroll to the footer
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
              <li><Link to="#contact" onClick={handleNavLinkClick}>contact</Link></li>
              <li><Link to="/login" onClick={toggleMenu}>login</Link></li>
            </ul>
          </div>
          <div className="navbar-toggle" onClick={toggleMenu}>
            <div className={`bar ${isOpen ? 'open' : ''}`}></div>
            <div className={`bar ${isOpen ? 'open' : ''}`}></div>
            <div className={`bar ${isOpen ? 'open' : ''}`}></div>
          </div>
      </nav>
      
        <div className='hero-container'>
          <video src={bgvideo} autoPlay loop muted />
          <p>protect your digital assets with blockchain!</p>
          <p>What are you waiting for?</p>
          <CoolButton/>
  
        </div>
        
        <div className='services' ref={serviceRef}>
          <h1>What services BDRM offers to you?</h1>
          <h3>the system has many features from simple file upload to advanced blockchain technologies. <br/>
            Including but not limited to:</h3>
          <ul>
            <li> Imutable record keeping!</li>
            <li> Decentralized Ownership Verification</li>
            <li> Smart Contract Automation</li>
            <li> Transparent Royalty Tracking</li>
            <li> Global Accessibility</li>
          </ul>
          <CoolButton/>
        </div>
  
        <div className='the-system'>
        <h1>how the system really works </h1>
        <div className='system'>
          <img src={decentral} alt="how it works" />
          <div>
            <h3>you will follow these simple steps to use use the system.</h3>
            <ul>
              <li> step1: upload your digital content. </li>
              <li> step2: register ownership on blockchain network. </li>
              <li> step3: set rights and permissions </li>
              <li> step4: monitor usage and Royalty </li>
            </ul>
          </div>
        </div>
          <CoolButton/>
        </div>
  
        <footer className="footer" ref={footerRef}>
        <div className="footer-content">
          <div className="footer-column">
            <h3>About Us</h3>
            <p>our goal is protecting the digital content of every individual in Ethiopia and abroad.</p>
          </div>
          <div className="footer-column">
            <h3>Services</h3>
            <ul>
              <li>upload contents</li>
              <li>use contents</li>
              <li>manage contents</li>
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
    );
  
      </div>
    );
  }
  
  
  
  
  export default Landing;