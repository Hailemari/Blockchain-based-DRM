import { useState, useEffect } from 'react';
import { getPendingContents, getApprovedContents, getRejectedContents, approveContent, rejectContent } from '../../utils/Interact';
import { ArrowLeftIcon, HomeIcon, UserIcon, DocumentTextIcon } from '@heroicons/react/solid';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ManageUsers from '../../components/ManageUsers';

const ipfsUrl = 'https://gateway.pinata.cloud/ipfs/';

const AdminDashboard = () => {
  const [pendingContents, setPendingContents] = useState([]);
  const [approvedContents, setApprovedContents] = useState([]);
  const [rejectedContents, setRejectedContents] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [contentObjectUrl, setContentObjectUrl] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [sidebarTab, setSidebarTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAllContents();
  }, []);

  useEffect(() => {
    if (sidebarTab === 'managecontent') {
      fetchContents();
    }
  }, [activeTab, sidebarTab]);

  const fetchAllContents = async () => {
    setIsLoading(true);
    try {
      const [pending, approved, rejected] = await Promise.all([
        getPendingContents(),
        getApprovedContents(),
        getRejectedContents(),
      ]);
      setPendingContents(pending);
      setApprovedContents(approved);
      setRejectedContents(rejected);
    } catch (error) {
      console.error('Error fetching content counts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContents = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'pending') {
        const contents = await getPendingContents();
        setPendingContents(contents);
      } else if (activeTab === 'approved') {
        const contents = await getApprovedContents();
        setApprovedContents(contents);
      } else if (activeTab === 'rejected') {
        const contents = await getRejectedContents();
        setRejectedContents(contents);
      }
    } catch (error) {
      console.error(`Cannot fetching ${activeTab} contents:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id, ipfsHash) => {
    setIsLoading(true);
    try {
      if (!ipfsHash) {
        throw new Error('IPFS hash is undefined');
      }
      console.log('IPFS hash to be approved:', ipfsHash);

      await approveContent(id, ipfsHash);
      fetchAllContents();
      toast.success('Content approved successfully!');
    } catch (error) {
      console.error('Error approving content:', error);
      toast.error('You approving content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (id) => {
    setIsLoading(true);
    try {
      await rejectContent(id);
      fetchAllContents();
      toast.success('Content rejected successfully!');
    } catch (error) {
      console.error('Error rejecting content:', error);
      toast.error('You rejecting content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContentFromIPFS = async (ipfsHash) => {
    setIsLoading(true);
    try {
      console.log(`${ipfsUrl}${ipfsHash}`)
      const response = await fetch(`${ipfsUrl}${ipfsHash}`);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      setContentObjectUrl(objectUrl);
    } catch (error) {
      console.error('Cannot fetching content from IPFS:', error);
      toast.error('Cannot fetching content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = (content) => {
    switch (content.contentType) {
      case 0: // Ebook
        return <iframe src={contentObjectUrl} title="Ebook" className="w-full h-full" />;
      case 1: // Video
        return <video src={contentObjectUrl} controls className="w-full h-full" />;
      case 2: // Music
        return <audio src={contentObjectUrl} controls className="w-full h-full" />;
      default:
        return <p className="text-red-500">Unsupported content type</p>;
    }
  };

  const handleDisplayContent = async (content) => {
    setSelectedContent(content);
    await fetchContentFromIPFS(content.ipfsHash);
  };

  const handleBack = () => {
    setSelectedContent(null);
    setContentObjectUrl(null);
  };

  const renderContentList = (contents) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contents.length > 0 ? (
          contents.map(content => (
            <div key={content.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{content.title}</h2>
                <p className="text-gray-600 mb-2">{content.description}</p>
                <p className="text-gray-500 text-sm">Creator: {content.creator}</p>
              </div>
              <div className="flex justify-between p-4">
                <button
                  className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${activeTab !== 'pending' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                  onClick={activeTab === 'pending' ? () => handleDisplayContent(content) : null}
                  disabled={activeTab !== 'pending'}
                >
                  Review
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center w-full text-gray-500">No {activeTab} contents available.</p>
        )}
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg shadow-sm flex flex-col items-center">
          <h3 className="text-xl font-bold text-blue-700">Pending Contents</h3>
          <p className="text-4xl font-bold text-blue-700">{pendingContents.length}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow-sm flex flex-col items-center">
          <h3 className="text-xl font-bold text-green-700">Approved Contents</h3>
          <p className="text-4xl font-bold text-green-700">{approvedContents.length}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg shadow-sm flex flex-col items-center">
          <h3 className="text-xl font-bold text-red-700">Rejected Contents</h3>
          <p className="text-4xl font-bold text-red-700">{rejectedContents.length}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/6 bg-gray-900 p-4 flex flex-col items-center justify-center shadow-lg">
        <h2 className="text-2xl font-bold mb-4 hidden lg:block text-white">DRM</h2>
        <button
          className={`w-full font-bold py-2 px-4 rounded-lg flex items-center justify-center space-x-4 transition duration-300 ${sidebarTab === 'dashboard' ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white hover:bg-gray-700'}`}
          onClick={() => setSidebarTab('dashboard')}
        >
          <HomeIcon className="h-6 w-6 text-green-500" />
          <span className="hidden lg:inline">Dashboard</span>
        </button>
        <button
          className={`w-full font-bold py-2 px-4 rounded-lg flex items-center justify-center mt-4 space-x-4 transition duration-300 ${sidebarTab === 'manageuser' ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white hover:bg-gray-700'}`}
          onClick={() => setSidebarTab('manageuser')}
        >
          <UserIcon className="h-6 w-6 text-green-500" />
          <span className="hidden lg:inline">Manage Users</span>
        </button>
        <button
          className={`w-full font-bold py-2 px-4 rounded-lg flex items-center justify-center mt-4 space-x-4 transition duration-300 ${sidebarTab === 'managecontent' ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white hover:bg-gray-700'}`}
          onClick={() => setSidebarTab('managecontent')}
        >
          <DocumentTextIcon className="h-6 w-6 text-green-500" />
          <span className="hidden lg:inline">Manage Content</span>
        </button>
      </div>

      <main className="w-5/6 flex flex-col bg-gray-50 p-6 shadow-lg overflow-y-auto">
        <ToastContainer />
        {sidebarTab === 'dashboard' && renderDashboard()}
        {sidebarTab === 'manageuser' && <ManageUsers />}
        {sidebarTab === 'managecontent' && (
          <div>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center mb-4">
              <button
                className={`py-2 px-4 my-1 sm:my-0 mx-1 sm:mx-3 ${activeTab === 'pending' ? 'bg-green-500 text-white' : 'bg-white text-green-500'} border border-green-500 rounded-l sm:rounded`}
                onClick={() => setActiveTab('pending')}
              >
                Pending
              </button>
              <button
                className={`py-2 px-4 my-1 sm:my-0 mx-1 sm:mx-3 ${activeTab === 'approved' ? 'bg-green-500 text-white' : 'bg-white text-green-500'} border border-green-500 sm:rounded`}
                onClick={() => setActiveTab('approved')}
              >
                Approved
              </button>
              <button
                className={`py-2 px-4 my-1 sm:my-0 mx-1 sm:mx-3 ${activeTab === 'rejected' ? 'bg-green-500 text-white' : 'bg-white text-green-500'} border border-green-500 rounded-r sm:rounded`}
                onClick={() => setActiveTab('rejected')}
              >
                Rejected
              </button>
            </div>

            {selectedContent ? (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                <div className="relative bg-white rounded-lg p-6 w-full max-w-3xl h-3/4 overflow-y-auto">
                  <button
                    className="absolute top-4 left-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                    onClick={handleBack}
                  >
                    <ArrowLeftIcon className="h-5 w-5 text-black" />
                  </button>
                  {renderContent(selectedContent)}
                  <div className="flex justify-end mt-4">
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                      onClick={() => handleApprove(selectedContent.id, selectedContent.ipfsHash)}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleReject(selectedContent.id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              renderContentList(
                activeTab === 'pending' ? pendingContents : activeTab === 'approved' ? approvedContents : rejectedContents
              )
            )}
          </div>
        )}
      </main>
      {isLoading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="w-16 h-16 border-4 border-t-transparent border-green-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-white text-lg">Please wait...</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
