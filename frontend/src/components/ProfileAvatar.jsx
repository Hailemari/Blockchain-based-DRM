import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";

export const ProfileAvatar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <button onClick={handleDropdown} className="focus:outline-none">
        <img
          src="https://i.pravatar.cc/150?img=9"
          alt="profile"
          className="h-12 w-12 rounded-full"
        />
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 overflow-hidden">
          <div className="p-4">
            <h1 className="text-lg font-semibold text-black">{user.name}</h1>
            <p className="text-gray-500">{user.email}</p>
          </div>
          <div className="border-t border-gray-200"></div>
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-black">
            <Link to="/user-dashboard">Dashboard</Link>
          </button>
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-black">
            Profile
          </button>
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-black">
            Settings
          </button>
          <div className="border-t border-gray-200"></div>
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

ProfileAvatar.propTypes = {
  user: PropTypes.object,
};
