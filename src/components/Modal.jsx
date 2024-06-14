import React from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ show, onClose, content, onApprove, onDecline }) => {
  if (!show) {
    return null;
  }

  const renderContent = () => {
    switch (content.type.toLowerCase()) {
      case 'video':
        return (
          <video controls className="w-full h-60 mb-4 rounded-md">
            <source src={content.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case 'image':
        return (
          <img 
            src={content.url} 
            alt="Content Thumbnail" 
            className="w-full h-60 object-cover mb-4 rounded-md"
          />
        );
      case 'pdf':
        return (
          <iframe
            src={content.url}
            title={content.title}
            className="w-full h-60 mb-4 rounded-md"
          ></iframe>
        );
      case 'music':
        return (
          <audio controls className="w-full mb-4 rounded-md">
            <source src={content.url} type="audio/mpeg" />
            Your browser does not support the audio tag.
          </audio>
        );
      default:
        return <p className="text-sm text-gray-500 mb-4">Unsupported content type</p>;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative bg-white p-6 border w-2/3 lg:w-1/2 shadow-lg rounded-md">
        <button 
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>
        <div className="text-center">
          {renderContent()}
          <h3 className="text-xl leading-6 font-medium text-gray-900 mb-2">
            {content.title}
          </h3>
          <div className="text-left mb-4">
            <p className="text-sm text-gray-500">
              <strong>Date Uploaded:</strong> {content.dateUploaded}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Owner:</strong> {content.owner}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Description:</strong> {content.description}
            </p>
          </div>
          {content.status === 'Pending' && (
            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full mr-2 shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                onClick={onApprove}
              >
                Approve
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full ml-2 shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                onClick={onDecline}
              >
                Decline
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
