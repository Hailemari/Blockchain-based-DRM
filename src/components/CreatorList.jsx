import React, { useState } from 'react';
import { FaSearch, FaEllipsisV, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const Creators = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sample data for creators
  const creatorsData = [
    { id: 1, name: 'Justin Septimus', email: 'example@email.com', totalContents: 25, status: 'Active', profile: 'Book writer', lastLogin: '14/APR/2020', joinDate: '15/APR/2020' },
    { id: 2, name: 'Anika Rhiel Madsen', email: 'example@email.com', totalContents: 15, status: 'Active', profile: 'Book writer', lastLogin: '14/APR/2020', joinDate: '15/APR/2020' },
    { id: 3, name: 'Miracle Vaccaro', email: 'example@email.com', totalContents: 40, status: 'Active', profile: 'Musician', lastLogin: '14/APR/2020', joinDate: '15/APR/2020' },
    { id: 4, name: 'Erin Levin', email: 'example@email.com', totalContents: 30, status: 'Active', profile: 'Book writer', lastLogin: '14/APR/2020', joinDate: '15/APR/2020' },
    { id: 5, name: 'Mira Herwitz', email: 'example@email.com', totalContents: 10, status: 'Inactive', profile: 'Videographer', lastLogin: '14/APR/2020', joinDate: '15/APR/2020' },
    { id: 6, name: 'Jaxson Siphorn', email: 'example@email.com', totalContents: 20, status: 'Inactive', profile: 'Book writer', lastLogin: '14/APR/2020', joinDate: '15/APR/2020' },
    { id: 7, name: 'Cheyenne Ekstrom Bothman', email: 'example@email.com', totalContents: 50, status: 'Inactive', profile: 'Book writer', lastLogin: '14/APR/2020', joinDate: '15/APR/2020' },
    { id: 8, name: 'Phillip Saris', email: 'example@email.com', totalContents: 5, status: 'Inactive', profile: 'Book writer', lastLogin: '14/APR/2020', joinDate: '15/APR/2020' },
    // Additional sample data to demonstrate pagination
    { id: 9, name: 'John Doe', email: 'john@example.com', totalContents: 12, status: 'Active', profile: 'Musician', lastLogin: '14/APR/2020', joinDate: '15/APR/2020' },
    { id: 10, name: 'Jane Smith', email: 'jane@example.com', totalContents: 8, status: 'Inactive', profile: 'Videographer', lastLogin: '14/APR/2020', joinDate: '15/APR/2020' },
  ];

  const filteredCreators = creatorsData.filter(creator =>
    creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    creator.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCreators.length / itemsPerPage);
  const currentCreators = filteredCreators.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage < totalPages ? prevPage + 1 : prevPage));
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Creators</h1>
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
            <th className="py-2 px-4 border-b"></th>
            <th className="py-2 px-4 border-b text-left">Name</th>
            <th className="py-2 px-4 border-b text-left">User Status</th>
            <th className="py-2 px-4 border-b text-left">Profile</th>
            <th className="py-2 px-4 border-b"></th>
          </tr>
        </thead>
        <tbody>
          {currentCreators.map((creator) => (
            <tr key={creator.id}>
              <td className="py-2 px-4 border-b">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-gray-600" />
              </td>
              <td className="py-2 px-4 border-b">
                <div className="flex flex-col">
                  <span className="font-semibold">{creator.name}</span>
                  <span className="text-sm text-gray-500">{creator.email}</span>
                </div>
              </td>
              <td className="py-2 px-4 border-b">
                <div className="flex flex-col">
                  <span className={`px-2 py-1 rounded-full text-sm ${creator.status === 'Active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                    {creator.status}
                  </span>
                  <span className="text-sm text-gray-500">Last login: {creator.lastLogin}</span>
                </div>
              </td>
              <td className="py-2 px-4 border-b">
                <div className="flex flex-col">
                  <span className="text-sm text-green-600">{creator.profile}</span>
                  <span className="text-sm text-gray-500">Joined on {creator.joinDate}</span>
                </div>
              </td>
              <td className="py-2 px-4 border-b text-right">
                <button className="text-gray-600 hover:text-gray-900">
                  <FaEllipsisV />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <div>
          Showing {currentCreators.length} of {filteredCreators.length} creators
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

export default Creators;
