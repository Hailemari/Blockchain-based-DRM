import React, { useState } from 'react';
import { FaUsers, FaExchangeAlt, FaUpload, FaCheck, FaHourglassHalf, FaSearch } from 'react-icons/fa';

const Dashboard = () => {
  const dashboardData = {
    totalTransactions: 65,
    totalUsers: 357,
    totalUpload: 75,
    totalApproved: 357,
    totalPending: 357,
  };

  const [dateRange, setDateRange] = useState("Filter by date");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dateRanges = ["Last 7 days", "Last 30 days", "Last 3 months", "Last 6 months", "Last year"];

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-lg mb-8">Welcome to the Admin Dashboard. Here you can manage all the system data and settings.</p>
      <div className="flex justify-between mb-8">
        <div className="relative w-full">
          <input 
            type="text" 
            placeholder="Search here" 
            className="w-full px-4 py-2 border rounded-lg focus:outline-none pl-10"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
        <div className="relative ml-4">
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {dateRange}
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                {dateRanges.map((range) => (
                  <a
                    href="#"
                    key={range}
                    onClick={() => {
                      setDateRange(range);
                      setDropdownOpen(false);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    role="menuitem"
                  >
                    {range}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <div className="flex justify-center mb-4 text-blue-500">
            <FaExchangeAlt size={30} />
          </div>
          <h2 className="text-xl font-semibold mb-4">Total Transactions</h2>
          <p className="text-2xl font-bold">{dashboardData.totalTransactions}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <div className="flex justify-center mb-4 text-blue-500">
            <FaUsers size={30} />
          </div>
          <h2 className="text-xl font-semibold mb-4">Total Users</h2>
          <p className="text-2xl font-bold">{dashboardData.totalUsers}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <div className="flex justify-center mb-4 text-blue-500">
            <FaUpload size={30} />
          </div>
          <h2 className="text-xl font-semibold mb-4">Total Upload</h2>
          <p className="text-2xl font-bold">{dashboardData.totalUpload}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <div className="flex justify-center mb-4 text-blue-500">
            <FaCheck size={30} />
          </div>
          <h2 className="text-xl font-semibold mb-4">Total Approved</h2>
          <p className="text-2xl font-bold">{dashboardData.totalApproved}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <div className="flex justify-center mb-4 text-blue-500">
            <FaHourglassHalf size={30} />
          </div>
          <h2 className="text-xl font-semibold mb-4">Total Pending</h2>
          <p className="text-2xl font-bold">{dashboardData.totalPending}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
