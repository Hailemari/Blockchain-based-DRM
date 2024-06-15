import { ethers } from 'ethers';
import ContentPlatform from './ContentPlatform.json';

const contractAddress = '0xD02E14654765d3c308C287c06e0e222ff30FAA55';

const getProvider = () => {
  if (typeof window.ethereum !== 'undefined') {
    return new ethers.providers.Web3Provider(window.ethereum);
  } else {
    throw new Error('Ethereum object not found, install MetaMask.');
  }
};

const getSigner = async () => {
  const provider = getProvider();
  const signer = provider.getSigner();
  return signer;
};

const getContract = async () => {
  try {
    const signer = await getSigner();
    return new ethers.Contract(contractAddress, ContentPlatform.abi, signer);
  } catch (error) {
    console.error('Error getting contract:', error);
    throw error;
  }
};

export const getPendingContents = async () => {
  try {
    const contract = await getContract();
    const contents = await contract.getPendingContents();
    return contents.map(content => ({
      id: content.id.toNumber(),
      creator: content.creator,
      title: content.title,
      description: content.description,
      price: ethers.utils.formatEther(content.price),
      contentType: parseInt(content.contentType),
    }));
  } catch (error) {
    console.error('Error fetching pending contents:', error);
    throw error;
  }
};

export const approveContent = async (id, ipfsHash) => {
  try {
    const contract = await getContract();
    const tx = await contract.approveContent(id, ipfsHash);
    await tx.wait();
  } catch (error) {
    console.error('Error approving content:', error);
    throw error;
  }
};

export const rejectContent = async (id) => {
  try {
    const contract = await getContract();
    const tx = await contract.rejectContent(id);
    await tx.wait();
  } catch (error) {
    console.error('Error rejecting content:', error);
    throw error;
  }
};
