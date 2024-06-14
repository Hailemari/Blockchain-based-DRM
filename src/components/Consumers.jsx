import React, { useState } from 'react';
import { FaSearch, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const Consumers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sample data for consumers
  const consumersData = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', totalPurchases: 5, status: 'Active', joinDate: '01/JAN/2020' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', totalPurchases: 8, status: 'Active', joinDate: '15/FEB/2020' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', totalPurchases: 2, status: 'Inactive', joinDate: '20/MAR/2020' },
    { id: 4, name: 'Diana Prince', email: 'diana@example.com', totalPurchases: 10, status: 'Active', joinDate: '05/APR/2020' },
    { id: 5, name: 'Edward Norton', email: 'edward@example.com', totalPurchases: 3, status: 'Inactive', joinDate: '10/MAY/2020' },
    { id: 6, name: 'Fiona Apple', email: 'fiona@example.com', totalPurchases: 4, status: 'Active', joinDate: '12/JUN/2020' },
    { id: 7, name: 'George Lucas', email: 'george@example.com', totalPurchases: 12, status: 'Active', joinDate: '14/JUL/2020' },
    { id: 8, name: 'Helen Mirren', email: 'helen@example.com', totalPurchases: 6, status: 'Inactive', joinDate: '16/AUG/2020' },
    { id: 9, name: 'Isaac Newton', email: 'isaac@example.com', totalPurchases: 9, status: 'Active', joinDate: '18/SEP/2020' },
    { id: 10, name: 'Jane Austen', email: 'jane@example.com', totalPurchases: 7, status: 'Active', joinDate: '20/OCT/2020' },
    { id: 11, name: 'Kevin Hart', email: 'kevin@example.com', totalPurchases: 15, status: 'Active', joinDate: '22/NOV/2020' },
    { id: 12, name: 'Liam Neeson', email: 'liam@example.com', totalPurchases: 5, status: 'Inactive', joinDate: '24/DEC/2020' },
  ];

  const filteredConsumers = consumersData.filter(consumer =>
    consumer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consumer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredConsumers.length / itemsPerPage);
  const currentConsumers = filteredConsumers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage < totalPages ? prevPage + 1 : prevPage));
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Consumers</h1>
      <div className="relative w-full mb-4">
        <input
          type="text"
          placeholder="Search here"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none pl-10"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Name</th>
            <th className="py-2 px-4 border-b text-left">Email</th>
            <th className="py-2 px-4 border-b text-left">Total Purchases</th>
            <th className="py-2 px-4 border-b text-left">Status</th>
            <th className="py-2 px-4 border-b text-left">Join Date</th>
          </tr>
        </thead>
        <tbody>
          {currentConsumers.map((consumer) => (
            <tr key={consumer.id}>
              <td className="py-2 px-4 border-b text-left">{consumer.name}</td>
              <td className="py-2 px-4 border-b text-left">{consumer.email}</td>
              <td className="py-2 px-4 border-b text-left">{consumer.totalPurchases}</td>
              <td className="py-2 px-4 border-b text-left">
                <span className={`px-2 py-1 rounded-full text-sm ${consumer.status === 'Active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                  {consumer.status}
                </span>
              </td>
              <td className="py-2 px-4 border-b text-left">{consumer.joinDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <div>
          Showing {currentConsumers.length} of {filteredConsumers.length} consumers
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handlePrevPage} 
            className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white'}`}
            disabled={currentPage === 1}
          >
            <FaArrowLeft />
          </button>
          <button 
            onClick={handleNextPage} 
            className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white'}`}
            disabled={currentPage === totalPages}
          >
            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Consumers;
