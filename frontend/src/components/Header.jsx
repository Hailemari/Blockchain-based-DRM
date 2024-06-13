import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Link to='/' className="text-white">BDRM</Link>
        <div className="block lg:hidden">
          <button onClick={toggleMenu} className="flex items-center px-3 py-2 border rounded text-gray-200 border-gray-400 hover:text-white hover:border-white">
            <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
          </button>
        </div>
      </div>
      <div className={`lg:flex items-center justify-center ${isOpen ? 'block' : 'hidden'}`}>
        <Link to="/home" className="block mt-4 lg:inline-block lg:mt-0 text-gray-300 hover:text-white mr-4" onClick={toggleMenu}>Home</Link>
        <Link to="#about" className="block mt-4 lg:inline-block lg:mt-0 text-gray-300 hover:text-white mr-4" onClick={toggleMenu}>About</Link>
        <Link to="#services" className="block mt-4 lg:inline-block lg:mt-0 text-gray-300 hover:text-white mr-4" onClick={toggleMenu}>Services</Link>
        <Link to="#contact" className="block mt-4 lg:inline-block lg:mt-0 text-gray-300 hover:text-white" onClick={toggleMenu}>Contact</Link>
      </div>
      <div>
        <Link to="/signin" className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-blue-500 hover:bg-white mt-4 lg:mt-0" onClick={toggleMenu}>Login</Link>
      </div>
    </nav>
  );
};

export default Header;