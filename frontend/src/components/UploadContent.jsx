import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Oval } from 'react-loader-spinner';
const pinataJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI0ZDlmNGJhZS1hYzlhLTQxNzUtYTQ4NC0wYWM0NWI2ZjRlZjYiLCJlbWFpbCI6ImhhaWxlbWFyaWFta2VmYWxlMTlAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6Ijc2ZWQ2NjU5ZmI1OTgxOGEzYWE2Iiwic2NvcGVkS2V5U2VjcmV0IjoiODk1ZWQwNmY3ODJiOWJkM2QyMmVlZDIyZWRlMTk0MmU0N2MwOTlmODc4NDA2NWUzODY5ODFmOWI4ZjViYzIzYSIsImlhdCI6MTcxODE4MTAyOX0.ZuXd19P02gV545n2VWzNQZ42qzZ21yzgJIudZ6kzPTY';
import { submitContentForReview, getCreatorContents, fetchSalesData } from '../utils/Interact';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPlus, FaTachometerAlt, FaShoppingCart } from 'react-icons/fa';
import DisplayContents from './DisplayContents';
import bookCoverImage from '../assets/images/book_cover.jpg';
import videoImage from '../assets/images/video.jpg';
import musicImage from '../assets/images/music.jpg';

const UploadContent = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [contentType, setContentType] = useState('0');
  const [ipfsHashes, setIpfsHashes] = useState([]);
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState('');
  const [contents, setContents] = useState([]);
  const [filteredContents, setFilteredContents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [salesData, setSalesData] = useState({ sales: [], totalIncome: '0' });
  const [loading, setLoading] = useState(false);
  const [viewOnly, setViewOnly] = useState(false);
  const [download, setDownload] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [activeSalesTab, setActiveSalesTab] = useState('all');

  const connectToMetaMask = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(newProvider);
        setAccount(accounts[0]);
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
        toast.error('Cannot connect to MetaMask');
      }
    } else {
      console.error('MetaMask not found. Please install MetaMask.');
      toast.error('MetaMask not found. Please install MetaMask.');
    }
  };

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          const newProvider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(newProvider);
          setAccount(accounts[0]);
        } else {
          setAccount('');
        }
      };

      window.ethereum.request({ method: 'eth_accounts' })
        .then(handleAccountsChanged)
        .catch(error => console.error('Error fetching accounts:', error));

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  useEffect(() => {
    if (account) {
      fetchCreatorContents();
      fetchSalesDataForCreator();
    }
  }, [account]);

  const fetchCreatorContents = async () => {
    setLoading(true);
    try {
      const contents = await getCreatorContents();
      setContents(contents);
      setFilteredContents(contents);
      setIpfsHashes(contents.map(content => content.ipfsHash));
    } catch (error) {
      console.error('Error fetching creator contents:', error);
      toast.error('Cannot fetch creator contents');
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesDataForCreator = async () => {
    setLoading(true);
    try {
      const data = await fetchSalesData(account);
      setSalesData(data);
    } catch (error) {
      console.error('Error fetching sales data:', error);
      toast.error('Cannot fetch sales data');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!provider) {
      toast.error('Please connect to MetaMask first.');
      return;
    }

    let errors = {};

    if (!title.trim()) {
      errors.title = 'Title is required';
    }
    if (!description.trim()) {
      errors.description = 'Description is required';
    }
    if (!price.trim()) {
      errors.price = 'Price is required';
    } else if (isNaN(parseFloat(price))) {
      errors.price = 'Price must be a valid number';
    } else if (parseFloat(price) <= 0) {
      errors.price = 'Price must be greater than 0';
    }
    if (!file) {
      errors.file = 'File is required';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.error('Please correct the errors in the form');
      return;
    }

    setValidationErrors({});
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${pinataJwt}`
        },
        body: formData
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status} - ${res.statusText}`);
      }

      const result = await res.json();
      const ipfsHash = result.IpfsHash;

      if (ipfsHashes.includes(ipfsHash)) {
        toast.error('This file has already been uploaded.');
        return;
      }

      const permissions = {
        viewOnly,
        download
      };

      try {
        const submissionResult = await submitContentForReview(title, description, ipfsHash, price, contentType, permissions);

        if (submissionResult.success) {
          toast.success('Content submitted for review successfully!');
          setIpfsHashes([...ipfsHashes, ipfsHash]);
          fetchCreatorContents();
          setFile(null); // Reset the file state after a successful upload
          setTitle(''); // Reset title
          setDescription(''); // Reset description
          setPrice(''); // Reset price
          setContentType('0'); // Reset content type
          setViewOnly(false); // Reset viewOnly
          setDownload(false); // Reset download
        } else {
          toast.error('User rejected transaction.');
        }
      } catch (transactionError) {
        if (transactionError.code === 'ACTION_REJECTED') {
          toast.error('User rejected transaction.');
        } else {
          throw transactionError;
        }
      }
    } catch (error) {
      toast.error('Cannot submit content for review');
      console.error('Error submitting content for review:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    const filtered = contents.filter(content =>
      content.title.toLowerCase().includes(event.target.value.toLowerCase()) ||
      content.description.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredContents(filtered);
  };

  const handleFilter = (type) => {
    if (type === "") {
      setFilteredContents(contents);
    } else {
      const filtered = contents.filter(content => content.contentType.toString() === type.toString());
      setFilteredContents(filtered);
    }
  };

  const handleShowManageContent = () => {
    setActiveTab('manage');
  };

  const handleShowDashboard = () => {
    setActiveTab('dashboard');
    fetchCreatorContents();
  };

  const handleShowUploadForm = () => {
    setActiveTab('upload');
  };

  const handleShowSales = () => {
    setActiveTab('sales');
    fetchSalesDataForCreator();
  };

  const handleSalesTabChange = (tab) => {
    setActiveSalesTab(tab);
  };

  const getImageForContentType = (contentType) => {
    switch (contentType) {
      case '0':
        return bookCoverImage;
      case '1':
        return videoImage;
      case '2':
        return musicImage;
      default:
        return bookCoverImage;
    }
  };

  const filteredSales = activeSalesTab === 'all'
    ? salesData.sales
    : salesData.sales.filter(content => content.contentType === activeSalesTab);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/6 bg-gray-900 p-4 flex flex-col items-center justify-center shadow-lg">
        <h2 className="text-2xl font-bold mb-4 hidden lg:block text-white">DRM</h2>
        <button
          className={`w-full font-bold py-2 px-4 rounded-lg flex items-center justify-center space-x-4 transition duration-300 ${activeTab === 'dashboard' ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white hover:bg-gray-700'}`}
          onClick={handleShowDashboard}
        >
          <FaTachometerAlt className="text-green-500" />
          <span className="hidden lg:inline">Dashboard</span>
        </button>
        <button
          className={`w-full font-bold py-2 px-4 rounded-lg flex items-center justify-center mt-4 space-x-4 transition duration-300 ${activeTab === 'manage' ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white hover:bg-gray-700'}`}
          onClick={handleShowManageContent}
        >
          <FaPlus className="text-green-500" />
          <span className="hidden lg:inline">Manage Content</span>
        </button>
        <button
          className={`w-full font-bold py-2 px-4 rounded-lg flex items-center justify-center mt-4 space-x-4 transition duration-300 ${activeTab === 'sales' ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white hover:bg-gray-700'}`}
          onClick={handleShowSales}
        >
          <FaShoppingCart className="text-green-500" />
          <span className="hidden lg:inline">Sales</span>
        </button>
      </div>

      <div className="w-5/6 p-8 bg-gray-50 overflow-y-auto">
        {!account ? (
          <div className="flex justify-center items-center h-full">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
              onClick={connectToMetaMask}
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <div className="flex justify-between items-center mb-8">
                <div className="max-w-lg mx-auto flex-1">
                  <input
                    className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    placeholder="Search contents..."
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
                <select
                  className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg ml-4 focus:outline-none"
                  onChange={(e) => handleFilter(e.target.value)}
                >
                  <option value="">All Content</option>
                  <option value="0">Ebook</option>
                  <option value="1">Video</option>
                  <option value="2">Music</option>
                </select>
              </div>
            )}

            {loading || uploading ? (
              <div className="flex justify-center items-center h-full">
                <Oval
                  height={100}
                  width={100}
                  color="#4fa94d"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                  ariaLabel='oval-loading'
                  secondaryColor="#4fa94d"
                  strokeWidth={2}
                  strokeWidthSecondary={2}
                />
                {uploading && <span className="ml-4 text-xl font-bold">Uploading...</span>}
              </div>
            ) : (
              <>
                {activeTab === 'manage' ? (
                  <div className="flex flex-col justify-center items-center h-full">
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full flex items-center justify-center text-4xl mb-2 transition duration-300"
                      style={{ transform: 'translateY(-50%)' }}
                      onClick={handleShowUploadForm}
                    >
                      <FaPlus />
                    </button>
                    <span className="text-xl text-green-700">Add Content</span>
                  </div>
                ) : activeTab === 'upload' ? (
                  <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
                <h2 className="text-3xl mb-8 font-bold text-center text-gray-800">Upload Content</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="mb-6">
                    <label className="block text-gray-700 text-lg font-semibold mb-2" htmlFor="title">
                      Title
                    </label>
                    <input
                      className="shadow-md appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="title"
                      type="text"
                      placeholder="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    {validationErrors.title && <p className="text-red-500 text-sm italic mt-2">{validationErrors.title}</p>}
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 text-lg font-semibold mb-2" htmlFor="price">
                      Price
                    </label>
                    <input
                      className="shadow-md appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="price"
                      type="text"
                      placeholder="Price in ETH"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                    {validationErrors.price && <p className="text-red-500 text-sm italic mt-2">{validationErrors.price}</p>}
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 text-lg font-semibold mb-2" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    className="shadow-md appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="description"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                  {validationErrors.description && <p className="text-red-500 text-sm italic mt-2">{validationErrors.description}</p>}
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 text-lg font-semibold mb-2" htmlFor="file">
                    File
                  </label>
                  <input
                    className="shadow-md appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                  />
                  {validationErrors.file && <p className="text-red-500 text-sm italic mt-2">{validationErrors.file}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="mb-6">
                    <label className="block text-gray-700 text-lg font-semibold mb-2">
                      Content Type
                    </label>
                    <select
                      className="shadow-md appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={contentType}
                      onChange={(e) => setContentType(e.target.value)}
                    >
                      <option value="0">Ebook</option>
                      <option value="1">Video</option>
                      <option value="2">Music</option>
                    </select>
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 text-lg font-semibold mb-2">
                      Permissions
                    </label>
                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        id="viewOnly"
                        checked={viewOnly}
                        onChange={(e) => setViewOnly(e.target.checked)}
                        className="mr-3"
                      />
                      <label htmlFor="viewOnly" className="text-gray-700">View</label>
                    </div>
                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        id="download"
                        checked={download}
                        onChange={(e) => setDownload(e.target.checked)}
                        className="mr-3"
                      />
                      <label htmlFor="download" className="text-gray-700">Download</label>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105"
                    type="button"
                    onClick={handleUpload}
                  >
                    Upload
                  </button>
                </div>
              </div>

                ) : activeTab === 'dashboard' ? (
                  <DisplayContents contents={filteredContents} />
                ) : activeTab === 'sales' ? (
                  <div className="bg-white shadow-lg rounded-lg p-6">
                      <h2 className="text-3xl font-bold mb-6 text-gray-800">Sales Data</h2>
                      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                        <h3 className="text-xl mb-4 md:mb-0 font-semibold">Number of Sold Contents: <span className="text-green-600">{salesData.sales.length}</span></h3>
                        <h3 className="text-xl mt-4 md:mt-0 font-semibold">Total Income: <span className="text-green-600">{salesData.totalIncome} ETH</span></h3>
                      </div>
                      
                      
                      
                      <div>
                        <h3 className="text-2xl font-semibold mb-6">Sold Contents</h3>
                        {filteredSales.length > 0 ? (
                          filteredSales.map((content, index) => (
                            <div key={index} className="flex flex-col sm:flex-row mb-6 p-6 bg-gray-100 rounded-lg shadow-md transform transition duration-300 hover:scale-105">
                              <img
                                src={getImageForContentType(content.contentType)}
                                alt={content.title}
                                className="h-20 w-20 object-cover rounded mb-4 sm:mb-0 sm:mr-6"
                              />
                              <div>
                                <h4 className="text-xl font-bold text-gray-800">{content.title}</h4>
                                <p className="text-gray-700">{content.description}</p>
                                <p className="text-gray-800"><strong>Sold for:</strong> <span className="text-green-600">{content.price} ETH</span></p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-600">No content sold yet.</p>
                        )}
                      </div>
                    </div>

                ) : null}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UploadContent;
