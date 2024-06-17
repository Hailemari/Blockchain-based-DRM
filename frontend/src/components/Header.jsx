import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
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

  const handleSettings = () => {
    closeMenu();
    navigate('/update-profile');
  };

  if (loading) {
    return null;
  }

  return (
    <header className="flex items-center justify-between p-4 bg-white text-gray-900 shadow-md">
      <div className="flex items-center space-x-2">
        {userType ? (
          <span className="text-3xl font-bold text-green-600 cursor-default">
            BDRM
          </span>
        ) : (
          <Link to="/" className="text-3xl font-bold text-green-600 hover:text-green-500 transition duration-300">
            BDRM
          </Link>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {userType ? (
          <div className="relative inline-block text-left">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none transition duration-300"
            >
              <FiUser className="text-xl text-gray-600" />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <div className="py-1">
                  <button
                    type="button"
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition duration-300"
                    onClick={handleSettings}
                  >
                    update-profile
                  </button>
                  <button
                    type="button"
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition duration-300"
                    onClick={handleLogout}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              to="/signin"
              className="text-lg text-green-500 border border-green-500 hover:bg-green-500 hover:text-white py-2 px-4 rounded-full transition duration-300"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-lg text-green-500 border border-green-500 hover:bg-green-500 hover:text-white py-2 px-4 rounded-full transition duration-300"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
};
