import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getAvailableContents, purchaseContent, getPurchasedContents, getContentPermissions } from '../utils/Interact';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTimes, FaSearch, FaTachometerAlt, FaFolderOpen, FaFileInvoiceDollar, FaExchangeAlt  } from 'react-icons/fa';
import bookCoverImage from '../assets/images/book_cover.jpg';
import videoImage from '../assets/images/video.jpg';
import musicImage from '../assets/images/music.jpg';
import licenseTemplate from '../assets/files/license_template.txt';


const ContentType = {
  0: 'Ebook',
  1: 'Video',
  2: 'Music',
};

const PurchaseContent = () => {
  const [contents, setContents] = useState([]);
  const [filteredContents, setFilteredContents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState('');
  const [selectedContent, setSelectedContent] = useState(null);
  const [purchasedContents, setPurchasedContents] = useState(new Set());
  const [transactions, setTransactions] = useState([]);
  const [licensingAgreement, setLicensingAgreement] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(false);
  const [contentToPurchase, setContentToPurchase] = useState(null);
  const [contentPrice, setContentPrice] = useState('');
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchAccountAndContents = async (account) => {
      if (!account) return;
      try {
        const purchased = await getPurchasedContents(account);
        const purchasedSet = new Set(purchased.map(content => content.id));
        setPurchasedContents(purchasedSet);
        setTransactions(purchased); 
        const contents = await getAvailableContents();
        setContents(contents);
        setFilteredContents(contents);
      } catch (error) {
        console.error('Error fetching contents:', error);
      }
    };
    
  
    const initializeProviderAndAccount = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const newProvider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(newProvider);
            setAccount(accounts[0]);
            await fetchAccountAndContents(accounts[0]);
          }
        } catch (error) {
          console.error('Error fetching accounts:', error);
        }
      } else {
        console.log('No Ethereum provider detected.');
      }
    };
  
    initializeProviderAndAccount();
  
    const handleAccountsChanged = async (accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        await fetchAccountAndContents(accounts[0]);
      } else {
        setAccount('');
        setPurchasedContents(new Set());
        setContents([]);
        setFilteredContents([]);
      }
    };
  
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
  
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);
  

  useEffect(() => {
    const fetchPurchasedContents = async () => {
      if (!account) return;
      try {
        const purchased = await getPurchasedContents(account);
        const purchasedSet = new Set(purchased.map(content => content.id));
        setPurchasedContents(purchasedSet);
      } catch (error) {
        console.error('Error fetching purchased contents:', error);
      }
    };
    const fetchAvailableContents = async () => {
      try {
        const contents = await getAvailableContents();
        setContents(contents);
        setFilteredContents(contents);
      } catch (error) {
        console.error('Error fetching contents:', error);
      }
    };
    
    fetchPurchasedContents();
    fetchAvailableContents();
    
  }, [account]);



  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    const filtered = contents.filter(content =>
      content.title.toLowerCase().includes(event.target.value.toLowerCase()) ||
      content.description.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredContents(filtered);
  };

  const handleFilter = (type) => {
    setSelectedFilter(type);
    setDropdownOpen(false);
    if (type === 'all') {
      setFilteredContents(contents);
    } else {
      const filtered = contents.filter(content => content.contentType.toString() === type.toString());
      setFilteredContents(filtered);
    }
  };

  const handlePurchase = async (contentId, creator, priceInEth) => {
    console.log('Attempting to purchase content:', contentId, 'Price:', priceInEth);
    
    if (!priceInEth) {
      toast.error('Price is not defined.');
      console.log('Price is not defined for content:', contentId);
      return;
    }
  
    if (account === creator) {
      toast.error('You cannot purchase your own content.');
      console.log('Attempted to purchase own content:', contentId);
      return;
    }
  
    if (purchasedContents.has(contentId)) {
      toast.error('You have already purchased this content.');
      console.log('Content already purchased:', contentId);
      return;
    }
  
    try {
      if (!provider) {
        toast.error('Please connect to MetaMask first.');
        console.log('No provider available.');
        return;
      }
  
      const tx = await purchaseContent(contentId, { value: ethers.utils.parseUnits(priceInEth, 'ether') });
      if (tx === undefined) {
        toast.error('Transaction failed. Please try again.');
        console.error('Transaction failed. tx is undefined');
        return;
      }
  
      await tx.wait();
      toast.success('Content purchased successfully');
      setPurchasedContents(new Set([...purchasedContents, contentId]));
      console.log('Content purchased successfully:', contentId);
    } catch (error) {
      if (error.message.includes('already purchased')) {
        toast.error('You have already purchased this content.');
        setPurchasedContents(new Set([...purchasedContents, contentId]));
      } else {
        toast.error('Error purchasing content');
      }
      console.error('Error purchasing content:', error);
    }
  };

  const fetchPermissionsAndGenerateAgreement = async (contentId, content) => {
    try {
      const permissions = await getContentPermissions(contentId);
      setPermissions(permissions);
      const agreement = `Licensing Agreement for Content ID ${contentId}:
        - Title: ${content.title}
        - Description: ${content.description}
        - Permissions: ${permissions.join(', ')}
      `;
      setLicensingAgreement(agreement);
    } catch (error) {
      console.error('Error fetching permissions and generating agreement:', error);
    }
  };

  const handleContentClick = (content) => {
    setSelectedContent(content);
    fetchPermissionsAndGenerateAgreement(content.id);
  };

  const renderContentPlayer = () => {
    if (!selectedContent) return null;

    const ipfsUrl = `http://127.0.0.1:8081/ipfs/${selectedContent.ipfsHash}`;

    switch (selectedContent.contentType) {
      case 0:
        return <iframe src={ipfsUrl} width="100%" height="100%" title={selectedContent.title} className="rounded border" />;
      case 1:
        return (
          <video width="100%" height="100%" controls className="rounded border">
            <source src={ipfsUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case 2:
        return (
          <audio controls className="w-full">
            <source src={ipfsUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        );
      default:
        return <p className="text-red-500">Unsupported content type</p>;
    }
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

  const handleAgreementModalOpen = async (content, price) => {
    await fetchPermissionsAndGenerateAgreement(content.id, content);
    setContentToPurchase(content);
    setContentPrice(price);
    setIsAgreementModalOpen(true);
  };
  

  const handleAgreementModalClose = () => {
    setIsAgreementModalOpen(false);
    setContentToPurchase(null);
    setContentPrice('');
  };

  const handleAgreementConsent = () => {
    if (contentToPurchase) {
      handlePurchase(contentToPurchase.id, contentToPurchase.creator, contentPrice);
      handleAgreementModalClose();
    }
  };  

  return (
    <div className="flex h-screen">
      <div className="w-1/6 bg-white shadow-lg flex flex-col items-center justify-center">
          <div className="flex flex-col space-y-4">
            <button
              className={`px-4 py-2 font-bold flex items-center text-gray-700 ${activeSection === 'Dashboard' ? 'bg-gray-300' : 'bg-white hover:bg-gray-200'}`}
              onClick={() => setActiveSection('Dashboard')}
            >
              <FaTachometerAlt className="mr-2 text-gray-700" />
              <span className="sidebar-text hidden sm:inline">Dashboard</span>
            </button>
            <button
              className={`px-4 py-2 font-bold flex items-center text-gray-700 ${activeSection === 'MyContents' ? 'bg-gray-300' : 'bg-white hover:bg-gray-200'}`}
              onClick={() => setActiveSection('MyContents')}
            >
              <FaFolderOpen className="mr-2 text-gray-700" />
              <span className="sidebar-text hidden sm:inline">MyContents</span>
            </button>
            <button
              className={`px-4 py-2 font-bold flex items-center text-gray-700 ${activeSection === 'Billing' ? 'bg-gray-300' : 'bg-white hover:bg-gray-200'}`}
              onClick={() => setActiveSection('Billing')}
            >
              <FaFileInvoiceDollar className="mr-2 text-gray-700" />
              <span className="sidebar-text hidden sm:inline">Billing</span>
            </button>
            <button
              className={`px-4 py-2 font-bold flex items-center text-gray-700 ${activeSection === 'Billing' ? 'bg-gray-300' : 'bg-white hover:bg-gray-200'}`}
              onClick={() => setActiveSection('Transactions')}
            >
              <FaExchangeAlt className="mr-2 text-gray-700" />
              <span className="sidebar-text hidden sm:inline">Transactions</span>
            </button>
           
           
          </div>
        </div>

      <div className="w-4/5 flex flex-col bg-gray-100 p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="relative flex items-center w-1/2">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search content..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <FaSearch className="absolute right-3 text-gray-400" />
          </div>
          <div className="relative inline-block text-left">
            <div>
              <button
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                id="options-menu"
                aria-haspopup="true"
                aria-expanded="true"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Filter
                <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06-.02L10 10.92l3.71-3.73a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            {dropdownOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => handleFilter('all')}
                  >
                    All
                  </button>
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => handleFilter(0)}
                  >
                    Ebook
                  </button>
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => handleFilter(1)}
                  >
                    Video
                  </button>
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => handleFilter(2)}
                  >
                    Music
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {activeSection === 'Dashboard' && (
          <div className="grid grid-cols-3 gap-4">
            {filteredContents
              .filter(content => !purchasedContents.has(content.id))
              .map(content => (
                <div key={content.id} className="bg-white p-4 rounded-lg shadow-md">
                  <img
                    src={getImageForContentType(content.contentType)}
                    alt={ContentType[content.contentType]}
                    className="h-40 w-full object-cover mb-4 rounded"
                  />
                  <div className="flex flex-wrap items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold mb-2">{content.title}</h3>
                      <p className="text-gray-600 mb-4">{content.description}</p>
                    </div>
                    <div>
                      <p className="text-gray-800 font-semibold mb-4">{content.price} ETH</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAgreementModalOpen(content, content.price)}
                    className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                  >
                    Purchase
                  </button>
                </div>
              ))}
          </div>
        )}

        {activeSection === 'MyContents' && (
          <div className="grid grid-cols-3 gap-4">
            {contents
              .filter(content => purchasedContents.has(content.id))
              .map(content => (
                <div key={content.id} className="bg-white p-4 rounded-lg shadow-md">
                  <img
                    src={getImageForContentType(content.contentType)}
                    alt={ContentType[content.contentType]}
                    className="h-40 w-full object-cover mb-4 rounded"
                  />
                  <h3 className="text-lg font-bold mb-2">{content.title}</h3>
                  <p className="text-gray-600 mb-4">{content.description}</p>
                  <button
                    onClick={() => handleContentClick(content)}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                  >
                    View
                  </button>
                </div>
              ))}
          </div>
        )}

        {activeSection === 'Billing' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Billing</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-bold mb-2">Total Number of Purchased Contents</h3>
                <p>{purchasedContents.size}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-bold mb-2">Total Price of Purchased Contents</h3>
                <p>
                  {Array.from(purchasedContents).reduce((total, contentId) => {
                    const content = contents.find(content => content.id === contentId);
                    return total + parseFloat(content.price);
                  }, 0)} ETH
                </p>
              </div>
            </div>
          </div>
        )}
        {activeSection === 'Transactions' && (
            <div className="mt-4 mx-auto px-4 sm:px-6 lg:px-8">
              {Array.isArray(transactions) && transactions.map((transaction, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 mb-6 sm:p-8">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">Transaction Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="mb-4 md:mb-0">
                      <p className="text-gray-600 text-lg"><strong>Seller Address:</strong></p>
                      <p className="font-semibold text-gray-800 break-all">{transaction.creator}</p>
                    </div>
                    <div className="mb-4 md:mb-0">
                      <p className="text-gray-600 text-lg"><strong>Buyer Address:</strong></p>
                      <p className="font-semibold text-gray-800 break-all">{account}</p>
                    </div>
                    <div className="mb-4 md:mb-0">
                      <p className="text-gray-600 text-lg"><strong>Price:</strong></p>
                      <p className="font-semibold text-gray-800">{transaction.price} ETH</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        {selectedContent && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
              <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-4xl h-4/5 overflow-y-auto">
                <button
                  className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
                  onClick={() => setSelectedContent(null)}
                >
                  <FaTimes size={24} />
                </button>
                <h3 className="text-2xl font-bold mb-4">{selectedContent.title}</h3>
                <div className="w-full h-96 mb-4">{renderContentPlayer()}</div>
              </div>
            </div>
          )}

          {isAgreementModalOpen && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
              <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-2xl h-3/5 overflow-y-auto">
                <button
                  className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
                  onClick={handleAgreementModalClose}
                >
                  <FaTimes size={24} />
                </button>
                <h3 className="text-2xl font-bold mb-4">Licensing Agreement</h3>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">{licensingAgreement}</pre>
                <div className="flex justify-end mt-4">
                  <button
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                    onClick={handleAgreementConsent}
                  >
                    Agree & Purchase
                  </button>
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mr-2"
                    onClick={handleAgreementModalClose}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default PurchaseContent;
