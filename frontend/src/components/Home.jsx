import { useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaPlus, FaShoppingCart } from 'react-icons/fa';

const HomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <main className="flex-grow container mx-auto py-12 px-6 md:px-12 lg:px-24">
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Welcome to DRM App</h2>
          <p className="text-gray-600 text-lg mb-6">Easily manage and monetize your digital content using our decentralized platform.</p>
          <button
            onClick={handleGetStarted}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full transition duration-300"
          >
            Get Started
          </button>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
          <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition duration-300">
            <FaPlus className="text-green-500 text-5xl mb-4 mx-auto" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Manage Content</h3>
            <p className="text-gray-600 mb-4">Easily manage all your digital content in one place.</p>
            
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition duration-300">
            <FaShoppingCart className="text-green-500 text-5xl mb-4 mx-auto" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Buy Content</h3>
            <p className="text-gray-600 mb-4">Purchase what you need directly from the creators</p>
           
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition duration-300">
            <FaShoppingCart className="text-green-500 text-5xl mb-4 mx-auto" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Sales</h3>
            <p className="text-gray-600 mb-4">Track your sales and revenue in real-time.</p>
           
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-6 w-full">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 DRM App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
