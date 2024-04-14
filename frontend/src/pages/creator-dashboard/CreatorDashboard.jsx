import {
  BiBell,
  BiSearch,
  BiBookAdd,
  BiHistory,
  BiPieChart,
} from "react-icons/bi";
import Search from "../../components/Search";
import { useState } from "react";
import { Link } from "react-router-dom";

export const CreatorDashboard = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAsideOpen, setIsAsideOpen] = useState(false);

  const toggleSearch = () => setShowSearch(!showSearch);
  const toggleModal = () => setOpenModal(!openModal);
  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const toggleAside = () => setIsAsideOpen(!isAsideOpen);

  const user = {
    name: "John Doe",
    email: "creator",
  };

  const contentTypes = ["Ebook", "Video", "Music"];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside
        className={`md:w-1/4 bg-gray-100 border-r border-gray-300 p-4 transition-all ${
          isAsideOpen ? "w-1/4" : "w-16"
        }`}
      >
        <div className=" mb-6">
          <img
            src="https://i.pravatar.cc/150?img=7"
            alt="profile"
            className="h-[200px] w-[200px] rounded-md mb-2"
          />
          <h1 className="text-xl font-bold">{user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
          <p className="mt-2">Creator Bio</p>
          <button className="relative bg-blue-500 text-white  mb-0">
            Logout
          </button>
        </div>
      </aside>
      <div className="md:w-3/4 bg-white p-4">
        <header className="border-b border-gray-300 pb-4 mb-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Creator Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="relative mr-4">
                <button className="text-blue-500" onClick={toggleSearch}>
                  <BiSearch className="inline-block" />
                </button>
                {showSearch && <Search onClose={toggleSearch} />}
              </div>

              <BiBell className="text-2xl cursor-pointer" />

              <button className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center space-x-2">
                <BiPieChart />
                <span>Sold Content</span>
              </button>

              <button className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center space-x-2">
                <BiHistory />
                <span>History</span>
              </button>
             
              <div className="relative">
                {/* Dropdown menu */}
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center space-x-2"
                  onClick={toggleDropdown}
                >
                  <BiBookAdd />
                  <span>Create Content</span>
                </button>
                {showDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                      Upload Video
                    </button>
                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Upload Audio
                    </button>
                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                      <Link to = "uploadbook"> Upload Book</Link>
                    </button>
                  </div>
                )}
              </div>
              
            </div>
          </div>
        </header>
        <button
        className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full z-50"
        onClick={toggleAside}
      >
        {isAsideOpen ? "<<" : ">>"}
      </button>
      </div>
    </div>
  );
};
