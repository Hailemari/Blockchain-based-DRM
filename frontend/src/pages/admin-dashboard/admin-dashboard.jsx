import { useState, useEffect } from 'react';
import { getPendingContents, getApprovedContents, getRejectedContents, approveContent, rejectContent } from '../../utils/Interact';
import { ArrowLeftIcon, HomeIcon, UserIcon, DocumentTextIcon } from '@heroicons/react/solid';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ipfsUrl = 'https://gateway.pinata.cloud/ipfs/';

const AdminDashboard = () => {
  const [pendingContents, setPendingContents] = useState([]);
  const [approvedContents, setApprovedContents] = useState([]);
  const [rejectedContents, setRejectedContents] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [contentObjectUrl, setContentObjectUrl] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [sidebarTab, setSidebarTab] = useState('dashboard');

  useEffect(() => {
    fetchAllContents();
  }, []);

  useEffect(() => {
    if (sidebarTab === 'managecontent') {
      fetchContents();
    }
  }, [activeTab, sidebarTab]);

  const fetchAllContents = async () => {
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
    }
  };

  const fetchContents = async () => {
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
      console.error(`Error fetching ${activeTab} contents:`, error);
    }
  };

  const handleApprove = async (id, ipfsHash) => {
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
      toast.error('Error approving content. Please try again.');
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectContent(id);
      fetchAllContents();
      toast.success('Content rejected successfully!');
    } catch (error) {
      console.error('Error rejecting content:', error);
      toast.error('Error rejecting content. Please try again.');
    }
  };

  const fetchContentFromIPFS = async (ipfsHash) => {
    try {
      console.log(`${ipfsUrl}${ipfsHash}`)
      const response = await fetch(`${ipfsUrl}${ipfsHash}`);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      setContentObjectUrl(objectUrl);
    } catch (error) {
      console.error('Error fetching content from IPFS:', error);
      toast.error('Error fetching content. Please try again.');
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
            <div key={content.id} className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{content.title}</h2>
                <p className="text-gray-600">{content.description}</p>
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
          <p>No {activeTab} contents available.</p>
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

  const renderManageUsers = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      <p className="text-gray-600">This section will be used to manage users</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-16 md:w-64 bg-white shadow-md flex flex-col justify-center items-center">
        <nav className="mt-4 flex flex-col space-y-2">
          <button
            className={`w-full text-center py-2 px-4 hover:bg-gray-200 flex items-center justify-center ${sidebarTab === 'dashboard' && 'bg-gray-200'}`}
            onClick={() => setSidebarTab('dashboard')}
          >
            <HomeIcon className="h-5 w-5" />
            <span className="hidden md:block ml-2">Dashboard</span>
          </button>
          <button
            className={`w-full text-center py-2 px-4 hover:bg-gray-200 flex items-center justify-center ${sidebarTab === 'manageuser' && 'bg-gray-200'}`}
            onClick={() => setSidebarTab('manageuser')}
          >
            <UserIcon className="h-5 w-5" />
            <span className="hidden md:block ml-2">Manage Users</span>
          </button>
          <button
            className={`w-full text-center py-2 px-4 hover:bg-gray-200 flex items-center justify-center ${sidebarTab === 'managecontent' && 'bg-gray-200'}`}
            onClick={() => setSidebarTab('managecontent')}
          >
            <DocumentTextIcon className="h-5 w-5" />
            <span className="hidden md:block ml-2">Manage Content</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <ToastContainer />
        {sidebarTab === 'dashboard' && renderDashboard()}
        {sidebarTab === 'manageuser' && renderManageUsers()}
        {sidebarTab === 'managecontent' && (
          <div>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center mb-4">
              <button
                className={`py-2 px-4 my-1 sm:my-0 mx-1 sm:mx-3 ${activeTab === 'pending' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'} border border-blue-500 rounded-l sm:rounded`}
                onClick={() => setActiveTab('pending')}
              >
                Pending
              </button>
              <button
                className={`py-2 px-4 my-1 sm:my-0 mx-1 sm:mx-3 ${activeTab === 'approved' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'} border border-blue-500 sm:rounded`}
                onClick={() => setActiveTab('approved')}
              >
                Approved
              </button>
              <button
                className={`py-2 px-4 my-1 sm:my-0 mx-1 sm:mx-3 ${activeTab === 'rejected' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'} border border-blue-500 rounded-r sm:rounded`}
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
    </div>
  );
};

export default AdminDashboard;
