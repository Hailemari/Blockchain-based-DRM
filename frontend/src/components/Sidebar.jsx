
import PropTypes from 'prop-types';
import { ethers } from 'ethers';

const ContentType = {
  0: 'Ebook',
  1: 'Video',
  2: 'Music',
};

const Sidebar = ({ contents, creatorInfo }) => {
  return (
    <div className="w-64 p-6 bg-gray-800 text-white">
      <h2 className="text-xl font-bold mb-4">Content Creator Info</h2>
      <p><span className="font-semibold">Name:</span> {creatorInfo.name}</p>
      <p><span className="font-semibold">Bio:</span> {creatorInfo.bio}</p>

      <h2 className="text-xl font-bold mt-6 mb-4">Your Contents</h2>
      {contents.length > 0 ? (
        <ul className="space-y-4">
          {contents.map((content, index) => (
            <li key={index} className="p-4 bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold">{content.title}</h3>
              <p>{content.description}</p>
              <p>Price: {ethers.utils.formatEther(content.price)} ETH</p>
              <p>IPFS Hash: {content.ipfsHash}</p>
              <p>Type: {ContentType[content.contentType]}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No contents found</p>
      )}
    </div>
  );
};

Sidebar.propTypes = {
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
  creatorInfo: PropTypes.shape({
    name: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
  }).isRequired,
};

export default Sidebar;
