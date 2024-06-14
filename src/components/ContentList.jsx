import React, { useState } from 'react';
import { FaSearch, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Modal from './Modal';

const ContentList = () => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContent, setSelectedContent] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const itemsPerPage = 15;

  // Sample data for content list
  const contentData = [
    { id: 1, title: 'Content 1', type: 'Video', owner: 'Owner 1', price: '$10.00', status: 'Approved', thumbnail: 'https://via.placeholder.com/150', dateUploaded: '2024-06-13', description: 'Description of Content 1' },
    { id: 2, title: 'Content 2', type: 'Article', owner: 'Owner 2', price: '$15.00', status: 'Pending', thumbnail: 'https://via.placeholder.com/150', dateUploaded: '2024-06-12', description: 'Description of Content 2' },
    { id: 3, title: 'Content 3', type: 'Podcast', owner: 'Owner 3', price: '$20.00', status: 'Rejected', thumbnail: 'https://via.placeholder.com/150', dateUploaded: '2024-06-11', description: 'Description of Content 3' },
    // ... (other content items)
  ];

  const filteredContent = contentData
    .filter(content => filter === 'All' || content.status === filter)
    .filter(content => content.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalPages = Math.ceil(filteredContent.length / itemsPerPage);
  const currentContent = filteredContent.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleCheckboxChange = (id) => {
    setSelectedContent(prevSelected => 
      prevSelected.includes(id)
        ? prevSelected.filter(contentId => contentId !== id)
        : [...prevSelected, id]
    );
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage < totalPages ? prevPage + 1 : prevPage));
  };

  const handleRowClick = (content) => {
    setModalContent(content);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalContent(null);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Content List</h1>
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
      <div className="mb-4 flex space-x-4">
        {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg ${filter === status ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {status}
          </button>
        ))}
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b"></th>
            <th className="py-2 px-4 border-b text-left">Title</th>
            <th className="py-2 px-4 border-b text-left">Type</th>
            <th className="py-2 px-4 border-b text-left">Owner</th>
            <th className="py-2 px-4 border-b text-left">Price</th>
          </tr>
        </thead>
        <tbody>
          {currentContent.map((content) => (
            <tr key={content.id} onClick={() => handleRowClick(content)} className="cursor-pointer">
              <td className="py-2 px-4 border-b text-center">
                <input
                  type="checkbox"
                  checked={selectedContent.includes(content.id)}
                  onChange={() => handleCheckboxChange(content.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </td>
              <td className="py-2 px-4 border-b text-left">{content.title}</td>
              <td className="py-2 px-4 border-b text-left">{content.type}</td>
              <td className="py-2 px-4 border-b text-left">{content.owner}</td>
              <td className="py-2 px-4 border-b text-left">{content.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <div>
          Showing {currentContent.length} of {filteredContent.length} contents
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
      <Modal show={showModal} onClose={handleCloseModal} content={modalContent} />
    </div>
  );
};

export default ContentList;
