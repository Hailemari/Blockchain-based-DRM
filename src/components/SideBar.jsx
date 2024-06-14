import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faListAlt, faChartPie } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const location = useLocation();
  const activeLink = location.pathname;

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col p-4 sticky top-0 h-screen">
      <div className="text-2xl font-bold mb-8">Logo</div>
      <div className="flex flex-col space-y-4">
        <SidebarLink to="/" icon={faHome} text="Dashboard" activeLink={activeLink} />
        <SidebarLink to="/content-list" icon={faListAlt} text="Content List" activeLink={activeLink} />
        <SidebarLink to="/creators" icon={faUser} text="Creators" activeLink={activeLink} />
        <SidebarLink to="/consumers" icon={faUser} text="Consumers" activeLink={activeLink} />
        <SidebarLink to="/analytics" icon={faChartPie} text="Analytics" activeLink={activeLink} />
      </div>
    </div>
  );
};

const SidebarLink = ({ to, icon, text, activeLink }) => {
  const isActive = activeLink === to;

  return (
    <Link to={to} className={`text-lg p-2 rounded flex items-center justify-start ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
      <FontAwesomeIcon icon={icon} className="mr-2" /> {text}
    </Link>
  );
};

export default Sidebar;
