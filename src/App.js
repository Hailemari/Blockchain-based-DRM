import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/SideBar';
import Dashboard from './components/Dashboard';
import ContentList from './components/ContentList';
import Creators from './components/CreatorList';
import Consumers from './components/Consumers';
// import Analytics from './components/Analytics';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-6 bg-gray-100">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/content-list" element={<ContentList />} />
            <Route path="/creators" element={<Creators />} />
            <Route path="/consumers" element={<Consumers />} />
            {/* <Route path="/analytics" element={<Analytics />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
