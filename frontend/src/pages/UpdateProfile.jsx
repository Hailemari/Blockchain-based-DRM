import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../Hooks/useAuth';

const UpdateProfile = () => {
  const { user, loading } = useAuth();
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [alert, setAlert] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormState({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.put('/api/users/update', formState, config);
      setAlert({ message: 'Profile updated successfully!', type: 'success' });
    } catch (error) {
      setAlert({ message: 'Failed to update profile', type: 'error' });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Update Profile</h2>
      {alert.message && (
        <div className={`p-4 mb-4 text-sm text-${alert.type === 'success' ? 'green' : 'red'}-700 bg-${alert.type === 'success' ? 'green' : 'red'}-100 rounded-lg`}>
          {alert.message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              className="mt-1 p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formState.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              className="mt-1 p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formState.lastName}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Email</label>
          <input
            type="email"
            name="email"
            className="mt-1 p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            value={formState.email}
            onChange={handleChange}
            disabled
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
