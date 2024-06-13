import PropTypes from 'prop-types';
import { ethers } from 'ethers';
import { ArrowLeftIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import bookCoverImage from '../assets/images/book_cover.jpg';
import videoImage from '../assets/images/video.jpg';
import musicImage from '../assets/images/music.jpg';

const ContentType = {
  0: 'Ebook',
  1: 'Video',
  2: 'Music',
};

const StatusMessages = {
  approved: 'Approved',
  pending: 'Pending',
  rejected: 'Rejected',
};

const getStatusColor = (status) => {
  switch (status) {
    case StatusMessages.approved:
      return 'bg-green-500';
    case StatusMessages.pending:
      return 'bg-yellow-500';
    case StatusMessages.rejected:
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const DisplayContents = ({ contents }) => {
  console.log(contents);
  const [selectedContent, setSelectedContent] = useState(null);
  const [contentObjectUrl, setContentObjectUrl] = useState(null);

  const fetchContentFromIPFS = async (ipfsHash) => {
    try {
      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      setContentObjectUrl(objectUrl);
    } catch (error) {
      console.error('Error fetching content from IPFS:', error);
    }
  };

  const renderContent = (content) => {
    if (!contentObjectUrl) return <p>Loading...</p>;

    switch (content.contentType) {
      case 0: // Ebook
        return <iframe src={contentObjectUrl} width="100%" height="100%" title={content.title} className="rounded border" />;
      case 1: // Video
        return (
          <video width="100%" height="100%" controls className="rounded border">
            <source src={contentObjectUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case 2: // Music
        return (
          <audio controls className="w-full">
            <source src={contentObjectUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        );
      default:
        return <p className="text-red-500">Unsupported content type</p>;
    }
  };

  const handleContentClick = async (content) => {
    setSelectedContent(content);
    await fetchContentFromIPFS(content.ipfsHash);
  };

  const handleBack = () => {
    setSelectedContent(null);
    setContentObjectUrl(null);
  };

  const getImageForContentType = (contentType) => {
    switch (contentType) {
      case 0:
        return bookCoverImage;
      case 1:
        return videoImage;
      case 2:
        return musicImage;
      default:
        return bookCoverImage;
    }
  };

  const getStatusMessage = (isActive, status) => {
    if (status === 2) {
      return StatusMessages.rejected;
    }
    return isActive ? StatusMessages.approved : StatusMessages.pending;
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold mb-8 text-center">Your Contents</h2>
      {selectedContent ? (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg p-6 w-full max-w-3xl h-3/4 overflow-y-auto shadow-xl">
            <button
              className="absolute top-4 left-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300"
              onClick={handleBack}
            >
              <ArrowLeftIcon className="h-6 w-6 text-black" />
            </button>
            {renderContent(selectedContent)}
          </div>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contents.map((content, index) => (
            <li key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 relative">
              <div className="cursor-pointer" onClick={() => handleContentClick(content)}>
                <img
                  src={getImageForContentType(content.contentType)}
                  alt={content.title}
                  className="rounded-lg w-full h-48 object-cover mb-4"
                />
                <div className={`absolute top-4 right-4 text-white px-3 py-1 rounded-full shadow-lg ${getStatusColor(getStatusMessage(content.isActive, content.status))}`}>
                  <p className="text-sm">{getStatusMessage(content.isActive, content.status)}</p>
                </div>
                <div className="flex flex-col space-y-2">
                  <h3 className="text-xl font-semibold text-gray-800">{content.title}</h3>
                  <p className="text-gray-600">{content.description}</p>
                  <p className="text-gray-500">
                    Price: {ethers.utils.formatEther(ethers.utils.parseUnits(content.price, 'ether'))} ETH
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

DisplayContents.propTypes = {
  contents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      creator: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      ipfsHash: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
      isActive: PropTypes.bool.isRequired,
      contentType: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default DisplayContents;
