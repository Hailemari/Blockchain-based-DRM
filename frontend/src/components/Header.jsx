import { FaBtc } from "react-icons/fa";
import { Link } from "react-router-dom";
import  { useState } from "react";
import { ProfileAvatar } from "./ProfileAvatar";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };
  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="flex items-center">
        <h1 className="flex text-3xl font-bold text-lime-600">
          <span className="text-yellow-400">
            <FaBtc />
          </span>
          <span>DRM</span>
        </h1>
      </div>

      <nav className="flex items-center space-x-4">
        <Link to="/" className="text-white hover:text-gray-300">
          Home
        </Link>
        <Link to="/about" className="text-white hover:text-gray-300">
          About
        </Link>
        <Link to="/contact" className="text-white hover:text-gray-300">
          Contact
        </Link>
      </nav>

      <div>
        {/* <Link to="user-dashboard" className="text-white hover:text-gray-300">
          Dashboard
        </Link> */}
        {/* <span className="mx-2">|</span> */}

        <ProfileAvatar user={{ name: "Usmael A", email: "uabdureman@gmail.com" }} />
      </div>
    </header>
  );
};
