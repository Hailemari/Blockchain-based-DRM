import { useRef, useState } from 'react';
import decentral from '../../assets/images/decentral.png';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import coverVideo from '../../assets/videos/cover-video.mp4'; // Import the video file
const CoolButton = ({ onClick }) => {
  return (
    <Link to='/newUser'>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
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
     
      <div className='hero-container'>
          <video src={coverVideo} autoPlay loop muted />
          <p>protect your digital assets with blockchain!</p>
          <p>What are you waiting for?</p>
          <CoolButton/>
  
        </div>


      <div className='hero-container'>
        <img src={decentral} alt="Blockchain illustration" className="hero-image" />
        <div className="text-center mt-8">
          <h1 className="text-4xl text-gray-900 leading-tight font-bold">Protect your digital assets with blockchain!</h1>
          <p className="mt-2 text-gray-600">What are you waiting for?</p>
          <CoolButton />
        </div>
      </div>

      <div className='services' ref={serviceRef}>
        <h2 className="text-3xl text-gray-900 leading-tight font-bold mt-12">What services BDRM offers to you?</h2>
        <p className="mt-4 text-gray-600">The system has many features from simple file upload to advanced blockchain technologies. Including but not limited to:</p>
        <ul className="list-disc list-inside mt-4 text-gray-600">
          <li>Immutable record keeping!</li>
          <li>Decentralized Ownership Verification</li>
          <li>Smart Contract Automation</li>
          <li>Transparent Royalty Tracking</li>
          <li>Global Accessibility</li>
        </ul>
        <CoolButton />
      </div>

      <div className='the-system'>
        <h2 className="text-3xl text-gray-900 leading-tight font-bold mt-12">How the system really works</h2>
        <div className='system mt-4 flex items-center justify-center'>
          <img src={decentral} alt="How it works" className="system-image" />
          <div className="ml-8">
            <p className="text-gray-600">You will follow these simple steps to use the system:</p>
            <ol className="list-decimal list-inside mt-4 text-gray-600">
              <li>Upload your digital content.</li>
              <li>Register ownership on blockchain network.</li>
              <li>Set rights and permissions.</li>
              <li>Monitor usage and Royalty.</li>
            </ol>
          </div>
        </div>
        {/* <CoolButton /> */}
      </div>
    </div>
  );
}



export default Landing;
