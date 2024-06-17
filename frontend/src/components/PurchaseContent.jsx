import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getAvailableContents, purchaseContent, getPurchasedContents, getContentPermissions } from '../utils/Interact';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTimes, FaSearch, FaTachometerAlt, FaFolderOpen, FaFileInvoiceDollar, FaExchangeAlt } from 'react-icons/fa';
import bookCoverImage from '../assets/images/book_cover.jpg';
import videoImage from '../assets/images/video.jpg';
import musicImage from '../assets/images/music.jpg';

const ipfsUrl = 'https://gateway.pinata.cloud/ipfs/';

const ContentType = {
  0: 'Ebook',
  1: 'Video',
  2: 'Music',
};

const fetchWithTimeout = (url, options, timeout = 10000) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Request timed out'));
    }, timeout);

    fetch(url, options)
      .then(response => {
        clearTimeout(timer);
        resolve(response);
      })
      .catch(err => {
        clearTimeout(timer);
        reject(err);
      });
  });
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
  const [contentObjectUrl, setContentObjectUrl] = useState(null);
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    const fetchAccountAndContents = async (account) => {
      if (!account) return;
      try {
        setIsLoading(true);
        const purchased = await getPurchasedContents(account);
        const purchasedSet = new Set(purchased.map(content => content.id));
        setPurchasedContents(purchasedSet);
        setTransactions(purchased);
        const contents = await getAvailableContents();
        setContents(contents);
        setFilteredContents(contents);
      } catch (error) {
        console.error('Error fetching contents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const initializeProviderAndAccount = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          setIsLoading(true);
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const newProvider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(newProvider);
            setAccount(accounts[0]);
            await fetchAccountAndContents(accounts[0]);
          }
        } catch (error) {
          console.error('Error fetching accounts:', error);
        } finally {
          setIsLoading(false);
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
        setIsLoading(true);
        const purchased = await getPurchasedContents(account);
        const purchasedSet = new Set(purchased.map(content => content.id));
        setPurchasedContents(purchasedSet);
      } catch (error) {
        console.error('Error fetching purchased contents:', error);
      } finally {
        setIsLoading(false);
      }
    };
    const fetchAvailableContents = async () => {
      try {
        setIsLoading(true);
        const contents = await getAvailableContents();
        setContents(contents);
        setFilteredContents(contents);
      } catch (error) {
        console.error('Error fetching contents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchasedContents();
    fetchAvailableContents();
  }, [account]);

  const handleConnectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setIsLoading(true);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(newProvider);
        setAccount(accounts[0]);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('No Ethereum provider detected.');
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    applyFiltersAndSearch(selectedFilter, event.target.value);
  };

  const handleFilter = (type) => {
    setSelectedFilter(type);
    setDropdownOpen(false);
    applyFiltersAndSearch(type, searchQuery);
  };

  const applyFiltersAndSearch = (filter, query) => {
    const lowercasedQuery = query.toLowerCase();
    const filtered = contents.filter(content => {
      const matchesSearch = content.title.toLowerCase().includes(lowercasedQuery) ||
        content.description.toLowerCase().includes(lowercasedQuery);
      const matchesFilter = filter === 'all' || content.contentType.toString() === filter.toString();
      return matchesSearch && matchesFilter;
    });
    setFilteredContents(filtered);
  };

  const handlePurchase = async (contentId, creator, priceInEth) => {
    console.log('Attempting to purchase content:', contentId, 'Price:', priceInEth);

    if (!priceInEth) {
      toast.error('Price is not defined.');
      console.log('Price is not defined for content:', contentId);
      return;
    }

    if (account.toLowerCase() === creator.toLowerCase()) {
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

      setIsLoading(true); 

      const tx = await purchaseContent(contentId, { value: ethers.utils.parseUnits(priceInEth, 'ether') });
      if (tx === undefined) {
        toast.error('Transaction failed. Please try again.');
        console.error('Transaction failed. tx is undefined');
        setIsLoading(false);  
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
        toast.error('Cannot purchase content');
      }
      console.error('Error purchasing content:', error);
    } finally {
      setIsLoading(false);  
    }
  };

  const fetchContentFromIPFS = async (ipfsHash) => {
    try {
      setIsLoading(true);
      const response = await fetchWithTimeout(`${ipfsUrl}${ipfsHash}`, {}, 10000); 
      if (!response.ok) {
        throw new Error('Failed to fetch content from IPFS');
      }
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      setContentObjectUrl(objectUrl);
    } catch (error) {
      console.error('Error fetching content from IPFS:', error);
      toast.error('Content cannot be found, try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchPermissionsAndGenerateAgreement = async (contentId, content) => {
    try {
      setIsLoading(true);  
      if (!content) {
        throw new Error('Content is undefined');
      }
      const permissions = await getContentPermissions(contentId);
      setPermissions(permissions);
      const agreement = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="text-align: center; color: #2c3e50;">Licensing Agreement</h2>

        <p><strong>This Licensing Agreement ("Agreement") is made and entered into by and between the content provider ("Licensor") and the content purchaser ("Licensee"). By purchasing and using the content, Licensee agrees to be bound by the terms and conditions of this Agreement.</strong></p>

        <hr style="margin: 20px 0; border: 1px solid #ddd;">

        <h3 style="color: #2c3e50;">1. Definitions</h3>
        <p><strong>1.1 "Content"</strong> refers to any digital product such as eBooks, videos, music, or other digital media made available for purchase.</p>
        <p><strong>1.2 "Platform"</strong> refers to the application or website where the Content is made available.</p>
        <p><strong>1.3 "License"</strong> refers to the rights granted to the Licensee to use the Content under the terms specified in this Agreement.</p>
        <p><strong>1.4 "Intellectual Property Rights"</strong> refers to all current and future rights of authorship, invention, or creation.</p>

        <hr style="margin: 20px 0; border: 1px solid #ddd;">

        <h3 style="color: #2c3e50;">2. License Grant</h3>
        <p><strong>2.1 Scope of License.</strong> Licensor grants Licensee a non-exclusive, non-transferable, and limited license to use the Content for personal, non-commercial purposes only.</p>
        <p><strong>2.2 Term.</strong> The License is granted for the duration specified at the time of purchase, or if no duration is specified, perpetually, subject to the terms of this Agreement.</p>

        <hr style="margin: 20px 0; border: 1px solid #ddd;">

        <h3 style="color: #2c3e50;">3. Usage Rights and Restrictions</h3>
        <p><strong>3.1 Permitted Uses.</strong> Licensee may:</p>
        <ul style="margin-left: 20px;">
          <li>Access and view the Content on any compatible device owned or controlled by the Licensee.</li>
          <li>${permissions.download ? 'Download a single copy of the Content for personal, non-commercial use.' : ''}</li>
        </ul>
        <p><strong>3.2 Prohibited Uses.</strong> Licensee shall not:</p>
        <ul style="margin-left: 20px;">
          <li>Reproduce, distribute, or publicly display the Content.</li>
          <li>Modify, create derivative works from, or reverse engineer the Content.</li>
          <li>Transfer, resell, or sublicense the Content to any third party.</li>
          <li>Use the Content for any commercial purposes without obtaining a separate commercial license from the Licensor.</li>
        </ul>

        <hr style="margin: 20px 0; border: 1px solid #ddd;">

        <h3 style="color: #2c3e50;">4. Intellectual Property Rights</h3>
        <p><strong>4.1 Ownership.</strong> The Content and all associated Intellectual Property Rights are owned by the Licensor or its licensors. Licensee does not acquire any ownership rights in the Content.</p>
        <p><strong>4.2 Protection.</strong> Licensee agrees to protect the Content and its Intellectual Property Rights from unauthorized use, reproduction, or distribution.</p>

        <hr style="margin: 20px 0; border: 1px solid #ddd;">

        <h3 style="color: #2c3e50;">5. Payment</h3>
        <p><strong>5.1 Price.</strong> The Licensee agrees to pay the price for the Content as specified at the time of purchase.</p>

        <hr style="margin: 20px 0; border: 1px solid #ddd;">

        <h3 style="color: #2c3e50;">6. Termination</h3>
        <p><strong>6.1 Termination by Licensor.</strong> Licensor may terminate this Agreement and the License granted to Licensee if Licensee breaches any terms of this Agreement.</p>
        <p><strong>6.2 Effect of Termination.</strong> Upon termination, Licensee must cease all use of the Content and destroy any copies in their possession.</p>

        <hr style="margin: 20px 0; border: 1px solid #ddd;">

        <h3 style="color: #2c3e50;">7. Disclaimer of Warranties</h3>
        <p><strong>7.1 No Warranty.</strong> The Content is provided "as is" without warranty of any kind. Licensor disclaims all warranties, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.</p>

        <hr style="margin: 20px 0; border: 1px solid #ddd;">

        <h3 style="color: #2c3e50;">8. Limitation of Liability</h3>
        <p><strong>8.1 Limitation.</strong> In no event shall Licensor be liable for any indirect, incidental, consequential, or punitive damages arising out of or in connection with this Agreement or the use of the Content.</p>

        <hr style="margin: 20px 0; border: 1px solid #ddd;">

        <h3 style="color: #2c3e50;">9. Miscellaneous</h3>
        <p><strong>9.1 Governing Law.</strong> This Agreement shall be governed by and construed in accordance with the laws of the jurisdiction in which the Licensor is based.</p>
        <p><strong>9.2 Entire Agreement.</strong> This Agreement constitutes the entire agreement between the parties concerning the subject matter hereof and supersedes all prior agreements and understandings.</p>
        <p><strong>9.3 Amendments.</strong> Licensor reserves the right to modify this Agreement at any time. Licensee's continued use of the Content after any such modifications shall constitute acceptance of the new terms.</p>
        <p><strong>9.4 Severability.</strong> If any provision of this Agreement is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.</p>

        <hr style="margin: 20px 0; border: 1px solid #ddd;">

        <h3 style="color: #2c3e50;">10. Contact Information</h3>
        <p>For any questions or concerns regarding this Agreement, please contact:</p>
        <p><strong>Licensor:</strong> ${content.creator}</p>
      

        <hr style="margin: 20px 0; border: 1px solid #ddd;">

        <p><strong>By purchasing and using the Content, the Licensee acknowledges that they have read, understood, and agreed to the terms and conditions of this Licensing Agreement.</strong></p>
      </div>
      `;
      setLicensingAgreement(agreement);
    } catch (error) {
      console.error('Error fetching permissions and generating agreement:', error);
    } finally {
      setIsLoading(false);  
    }
  };

  const handleContentClick = async (content) => {
    setSelectedContent(null); 
    setContentObjectUrl(null); 
    setIsLoading(true); 

    setSelectedContent(content); 

    try {
      await fetchContentFromIPFS(content.ipfsHash);
      await fetchPermissionsAndGenerateAgreement(content.id, content);
    } catch (error) {
      console.error('Error handling content click:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContentPlayer = () => {
    if (isLoading || !selectedContent || !contentObjectUrl) return null;
  
    return (
      <div className="flex flex-col space-y-4 h-full">
        {selectedContent.contentType === 0 && (
          <iframe
            src={contentObjectUrl}
            width="100%"
            height="700px" 
            title={selectedContent.title}
            className="rounded border"
          />
        )}
        {selectedContent.contentType === 1 && (
          <video width="100%" height="700px" controls className="rounded border"> 
            <source src={contentObjectUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        {selectedContent.contentType === 2 && (
          <audio controls className="w-full">
            <source src={contentObjectUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
        {permissions.download && (
          <a
            href={contentObjectUrl}
            download={selectedContent.title}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300 text-center"
          >
            Download
          </a>
        )}
      </div>
    );
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
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/6 bg-gray-900 p-4 flex flex-col items-center justify-center shadow-lg">
        <h2 className="text-2xl font-bold mb-4 hidden lg:block text-white">DRM</h2>
        <button
          className={`w-full font-bold py-2 px-4 rounded-lg flex items-center justify-center space-x-4 transition duration-300 ${activeSection === 'Dashboard' ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white hover:bg-gray-700'}`}
          onClick={() => setActiveSection('Dashboard')}
        >
          <FaTachometerAlt className="text-green-500" />
          <span className="hidden lg:inline">Dashboard</span>
        </button>
        <button
          className={`w-full font-bold py-2 px-4 rounded-lg flex items-center justify-center mt-4 space-x-4 transition duration-300 ${activeSection === 'MyContents' ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white hover:bg-gray-700'}`}
          onClick={() => setActiveSection('MyContents')}
        >
          <FaFolderOpen className="text-green-500" />
          <span className="hidden lg:inline">MyContents</span>
        </button>
        <button
          className={`w-full font-bold py-2 px-4 rounded-lg flex items-center justify-center mt-4 space-x-4 transition duration-300 ${activeSection === 'Billing' ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white hover:bg-gray-700'}`}
          onClick={() => setActiveSection('Billing')}
        >
          <FaFileInvoiceDollar className="text-green-500" />
          <span className="hidden lg:inline">Billing</span>
        </button>
        <button
          className={`w-full font-bold py-2 px-4 rounded-lg flex items-center justify-center mt-4 space-x-4 transition duration-300 ${activeSection === 'Transactions' ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white hover:bg-gray-700'}`}
          onClick={() => setActiveSection('Transactions')}
        >
          <FaExchangeAlt className="text-green-500" />
          <span className="hidden lg:inline">Transactions</span>
        </button>
      </div>

      <div className="w-5/6 flex flex-col bg-gray-50 p-6 shadow-lg overflow-y-auto">
        {!account && (
          <div className="flex justify-center items-center h-full">
            <button
              onClick={handleConnectWallet}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            >
              Connect Wallet
            </button>
          </div>
        )}

        {account && (
          <>
            {activeSection !== 'Transactions' && activeSection !== 'Billing' && (
              <div className="flex items-center justify-between mb-6">
                <div className="relative w-full max-w-md mx-auto">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search content..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300"
                  />
                  <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
            )}

            {activeSection === 'Dashboard' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContents.length === 0 ? (
                  <div className="text-center col-span-full text-gray-700 font-bold">
                    No available contents for now
                  </div>
                ) : (
                  filteredContents
                    .filter(content => !purchasedContents.has(content.id))
                    .map(content => (
                      <div key={content.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
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
                          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition duration-300"
                        >
                          Purchase
                        </button>
                      </div>
                    ))
                )}
              </div>
            )}

            {activeSection === 'MyContents' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContents
                  .filter(content => purchasedContents.has(content.id))
                  .length === 0 ? (
                    <div className="text-center col-span-full text-gray-700 font-bold">
                      You have no content.
                    </div>
                  ) : (
                    filteredContents
                      .filter(content => purchasedContents.has(content.id))
                      .map(content => (
                        <div key={content.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                          <img
                            src={getImageForContentType(content.contentType)}
                            alt={ContentType[content.contentType]}
                            className="h-40 w-full object-cover mb-4 rounded"
                          />
                          <h3 className="text-lg font-bold mb-2">{content.title}</h3>
                          <p className="text-gray-600 mb-4">{content.description}</p>
                          <button
                            onClick={() => handleContentClick(content)}
                            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
                          >
                            View
                          </button>
                        </div>
                      ))
                  )}
              </div>
            )}

            {activeSection === 'Billing' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Billing</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                    <h3 className="text-lg font-bold mb-2">Total Number of Purchased Contents</h3>
                    <p>{purchasedContents.size}</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
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
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Transaction Details</h3>
                {Array.isArray(transactions) && transactions.map((transaction, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6 mb-6 sm:p-8 hover:shadow-xl transition duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="mb-4 md:mb-0">
                        <p className="text-gray-600 text-lg"><strong>Seller</strong></p>
                        <p className="font-semibold text-gray-800 break-all">{transaction.creator}</p>
                      </div>
                      <div className="mb-4 md:mb-0">
                        <p className="text-gray-600 text-lg"><strong>Buyer</strong></p>
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
          </>
        )}

        {selectedContent && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-4xl h-full overflow-y-auto">
              <button
                className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
                onClick={() => setSelectedContent(null)}
              >
                <FaTimes size={24} />
              </button>
              <h3 className="text-2xl font-bold mb-4">{selectedContent.title}</h3>
              <div className="w-full h-full mb-4">{renderContentPlayer()}</div>
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
              <div className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto" dangerouslySetInnerHTML={{ __html: licensingAgreement }}></div>
              <div className="flex justify-end mt-4">
                <button
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
                  onClick={handleAgreementConsent}
                >
                  Agree & Purchase
                </button>
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mr-2 transition duration-300"
                  onClick={handleAgreementModalClose}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="w-16 h-16 border-4 border-t-transparent border-green-500 rounded-full animate-spin"></div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default PurchaseContent;
