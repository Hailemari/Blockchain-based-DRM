// Interact.js
import { ethers } from 'ethers';
import axios from 'axios';
import ContentPlatform from './ContentPlatform.json';

const contractAddress = '0xD02E14654765d3c308C287c06e0e222ff30FAA55';

const apiUrl = 'http://localhost:5000/auth';

export const getUsers = async () => {
  try {
    const response = await axios.get(`${apiUrl}/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};


export const removeUser = async (userId) => {
  try {
    const response = await axios.delete(`${apiUrl}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing user:', error);
    throw error;
  }
};


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
      ipfsHash: content.ipfsHash, 
      price: ethers.utils.formatEther(content.price),
      isActive: content.isActive,
      contentType: parseInt(content.contentType),
    }));
  } catch (error) {
    console.error('Error fetching pending contents:', error);
    throw error;
  }
};

export const getContentPermissions = async (contentId) => {
  try {
    const contract = await getContract();
    const permissions = await contract.getContentPermissions(contentId);
    return permissions;
  } catch (error) {
    console.error('Error fetching content permissions:', error);
    throw error;
  }
};

export const submitContentForReview = async (title, description, ipfsHash, price, contentType, permissions) => {
  try {
    const contract = await getContract();
    const tx = await contract.submitContentForReview(
      title,
      description,
      ipfsHash,
      ethers.utils.parseEther(price),
      contentType,
      permissions
    );
    await tx.wait();
    return { success: true };
  } catch (error) {
    console.error('Error submitting content for review:', error);
    return { success: false, message: error.message };
  }
};


const checkContentExists = async (ipfsHash) => {
  const contract = await getContract();
  const [exists] = await contract.getContentByHash(ipfsHash);
  return exists;
};


export const getContentByHash = async (ipfsHash) => {
  const contract = await getContract();
  const [exists, content] = await contract.getContentByHash(ipfsHash);
  return { exists, content };
};

export const createContent = async (title, description, ipfsHash, price, contentType) => {
  try {
    console.log('Creating content:', title, description, ipfsHash, price, contentType)
    const contract = await getContract();
    console.log('Checking content exists:', ipfsHash);
    const contentExists = await checkContentExists(ipfsHash);
    if (contentExists) {
      return { success: false, message: 'Content already exists' };
    }
    console.log('Creating content:', title, description, ipfsHash, price, contentType)
    const tx = await contract.createContent(title, description, ipfsHash, ethers.utils.parseEther(price), contentType);
    console.log('price', ethers.utils.parseEther(price))
    console.log('Transaction:', tx)
    await tx.wait();
    return { success: true };
  } catch (error) {
    console.error('Error creating content:', error);
    return { success: false, message: error.message };
  }
};


export const purchaseContent = async (id, options) => {
  try {
    const contract = await getContract();
    console.log('Purchasing content:', id, options);
    const tx = await contract.purchaseContent(id, options);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Error purchasing content:', error);
    throw error;
  }
};


export const getCreatorContents = async () => {
  try {
    const signer = await getSigner();
    const creatorAddress = await signer.getAddress(); 
    const contract = await getContract();
    const contents = await contract.getCreatorContents(creatorAddress);
    return contents.map(content => ({
      id: content.id.toNumber(),
      creator: content.creator,
      title: content.title,
      description: content.description,
      ipfsHash: content.ipfsHash,
      price: ethers.utils.formatEther(content.price),
      isActive: content.isActive,
      contentType: parseInt(content.contentType),
      status: parseInt(content.status),
    }));
  } catch (error) {
    console.error('Error fetching creator contents:', error);
    throw error;
  }
};


export const getAvailableContents = async () => {
  try {
    const contract = await getContract();
    const contents = await contract.getAvailableContents();
    console.log('Available contents:', contents);
    return contents.map(content => ({
      id: content.id.toNumber(),
      creator: content.creator,
      title: content.title,
      description: content.description,
      ipfsHash: content.ipfsHash,
      price: ethers.utils.formatEther(content.price),
      isActive: content.isActive,
      contentType: parseInt(content.contentType),
      status: content.status,
    }));
  } catch (error) {
    console.error('Error fetching available contents:', error);
    throw error;
  }
};


export const getPurchasedContents = async (account) => {
  try {
    const contract = await getContract();
    const contents = await contract.getPurchasedContents(account);
    return contents.map(content => ({
      id: content.id.toNumber(),
      creator: content.creator,
      title: content.title,
      description: content.description,
      ipfsHash: content.ipfsHash,
      price: ethers.utils.formatEther(content.price),
      isActive: content.isActive,
      contentType: parseInt(content.contentType),
    }));
  } catch (error) {
    console.error('Error fetching purchased contents:', error);
    throw error;
  }
};


export const getPurchasedContentsCount = (purchasedContents) => {
  return purchasedContents.length;
};

export const getTotalCost = (purchasedContents, allContents) => {
  let totalCost = 0;
  purchasedContents.forEach((contentId) => {
    const content = allContents.find((content) => content.id === contentId);
    if (content) {
      totalCost += parseFloat(content.price);
    }
  });
  return totalCost;
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


export const getSoldContentsAndIncome = async (creator) => {
  try {
    const contract = await getContract();
    const [soldContents, totalIncome] = await contract.getSoldContentsAndIncome(creator);
    console.log('Sold contents:', soldContents);
    console.log('Creator', creator)
    return {
      soldContents: soldContents.map(content => ({
        id: content.id.toNumber(),
        creator: content.creator,
        title: content.title,
        description: content.description,
        ipfsHash: content.ipfsHash,
        price: ethers.utils.formatEther(content.price),
        isActive: content.isActive,
        contentType: parseInt(content.contentType),
      })),
      totalIncome: ethers.utils.formatEther(totalIncome)
    };
  } catch (error) {
    console.error('Error fetching sold contents and income:', error);
    throw error;
  }
};


export const getApprovedContents = async () => {
  try {
    const contract = await getContract();
    const contents = await contract.getApprovedContents();
    return contents.map(content => ({
      id: content.id.toNumber(),
      creator: content.creator,
      title: content.title,
      description: content.description,
      ipfsHash: content.ipfsHash,
      price: ethers.utils.formatEther(content.price),
      isActive: content.isActive,
      contentType: parseInt(content.contentType),
    }));
  } catch (error) {
    console.error('Error fetching approved contents:', error);
    throw error;
  }
};

export const getRejectedContents = async () => {
  try {
    const contract = await getContract();
    const contents = await contract.getRejectedContents();
    return contents.map(content => ({
      id: content.id.toNumber(),
      creator: content.creator,
      title: content.title,
      description: content.description,
      ipfsHash: content.ipfsHash,
      price: ethers.utils.formatEther(content.price),
      isActive: content.isActive,
      contentType: parseInt(content.contentType),
    }));
  } catch (error) {
    console.error('Error fetching rejected contents:', error);
    throw error;
  }
};




export const fetchSalesData = async (creatorAddress) => {
  const contract = await getContract();
  const filter = contract.filters.ContentPurchased(null, null, creatorAddress);

  const events = await contract.queryFilter(filter);
  const sales = events.map((event) => {
    return {
      id: event.args.id.toNumber(),
      buyer: event.args.buyer,
      creator: event.args.creator,
      ipfsHash: event.args.ipfsHash,
      price: ethers.utils.formatEther(event.args.price),
      
    };
  });

  const totalIncome = sales.reduce((total, sale) => total + parseFloat(sale.price), 0);

  return { sales, totalIncome };
};