import  { useState } from "react";
import { BiEdit, BiBell, BiSearch } from "react-icons/bi";
import Greetings from "../../components/greeting";
import Search from "../../components/search";

const UserDashboard = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const userInfo = getUserInfo();

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 1:
        return renderContentByType("Ebook");
      case 2:
        return renderContentByType("Video");
      case 3:
        return renderContentByType("Music");
      case 4:
        return renderUsageHistory();
      default:
        return null;
    }
  };

  const renderContentByType = (type) => {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">{type}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {userInfo[0][type].map((item) => (
            <div
              key={item.id}
              className="bg-gray-100 p-4 rounded-md border border-gray-300"
            >
              <h2 className="text-lg font-bold">{item.name}</h2>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderUsageHistory = () => {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Usage History</h1>
        {/* Render usage history content */}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="md:w-1/4 bg-gray-100 border-r border-gray-300 p-4">
        {userInfo.map((user) => (
          <div key={user.id} className="mb-6">
            <img
              src="https://i.pravatar.cc/150?img=7"
              alt="profile"
              className=" h-[200px] w-[200px] rounded-md mb-2"
            />
            <h1 className="text-xl font-bold">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-600">{user.email}</p>
            <p className="mt-2">{user.bio}</p>
          </div>
        ))}
      </aside>
      <div className="md:w-3/4 bg-white p-4">
        <header className="border-b border-gray-300 pb-4 mb-4">
          <div className="flex justify-between items-center">
            <Greetings />
            <div className="flex items-center">
              <div className="relative mr-4">
                <button className="text-blue-500" onClick={toggleSearch}>
                  <BiSearch className="inline-block" />
                </button>
                {showSearch && <Search onClose={toggleSearch} />}
              </div>
              <div className="mr-4">
                <button className="text-blue-500 relative">
                  <BiBell className="inline-block" />
                  <span className="absolute top-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 text-sm rounded opacity-0 transition-opacity duration-300 pointer-events-none">
                    Notifications
                  </span>
                </button>
              </div>
              <div>
                <button className="text-blue-500 relative">
                  <BiEdit className="inline-block" />
                  <span className="absolute top-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 text-sm rounded opacity-0 transition-opacity duration-300 pointer-events-none">
                    Edit Profile
                  </span>
                </button>
              </div>
            </div>
          </div>
        </header>
        <div>
          <div className="flex mb-4">
            <button
              className={`mr-2 p-2 ${
                activeTab === 1 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setActiveTab(1)}
            >
              Ebook
            </button>
            <button
              className={`mr-2 p-2 ${
                activeTab === 2 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setActiveTab(2)}
            >
              Video
            </button>
            <button
              className={`mr-2 p-2 ${
                activeTab === 3 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setActiveTab(3)}
            >
              Music
            </button>
            <button
              className={`p-2 ${
                activeTab === 4 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setActiveTab(4)}
            >
              Usage History
            </button>
          </div>
          <div>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

const getUserInfo = () => {
  return [
    {
      id: 1,
      firstName: "Naol",
      lastName: "D",
      email: "naol@gmail.com",
      bio: "I am a software engineer",
      Ebook: [
        {
          id: 1,
          name: "JavaScript",
          description: "JavaScript for beginners",
        },
        {
          id: 2,
          name: "React",
          description: "React for beginners",
        },
        {
          id: 3,
          name: "Node",
          description: "Node for beginners",
        },
      ],
      Video: [
        {
          id: 1,
          name: "JavaScript",
          description: "JavaScript for beginners video",
        },
      ]
    },
  ];
}