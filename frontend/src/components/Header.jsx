import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBtc, FaUser } from 'react-icons/fa';
import useAuth from '../Hooks/useAuth';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userType, logout, loading } = useAuth();  
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    closeMenu();
    logout();
    navigate('/signin');
  };

  if (loading) {
    return null; 
  }

  return (
    <header className="flex items-center justify-between p-4 bg-white text-gray-900 shadow-md">
      <div className="flex items-center space-x-2">
        <FaBtc className="text-4xl text-yellow-400" />
        <Link to="/" className="text-3xl font-bold text-lime-600 hover:text-lime-500 transition duration-300">
          DRM
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        {userType ? (  
          <div className="relative inline-block text-left">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none"
            >
              <FaUser className="text-xl text-gray-400" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-1 h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M6.293 7.293a1 1 0 011.414 0L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <div className="py-1">
                  <Link
                    to="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={closeMenu}
                  >
                    settings
                  </Link>
                  
                  <button
                    type="button"
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link to="/signin" className="text-lg text-gray-900 hover:text-gray-500">Sign In</Link>
        )}
      </div>
    </header>
  );
};
