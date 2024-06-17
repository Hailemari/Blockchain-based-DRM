import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
        const token = localStorage.getItem('authToken');
      try {
        const response = await fetch('http://localhost:5000/auth/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',

            // Add Authorization header if you're using JWT tokens
            // 'Authorization': `Bearer ${yourToken}`,
          },
        //   credentials: 'include', // To include cookies (if using)
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const userData = await response.json();
        setUser(userData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Handle error or redirect as needed
        navigate('/signin'); // Redirect to login page on error
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>; // Handle case where user data is not retrieved
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">User Profile</h2>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">First Name</label>
        <input
          type="text"
          className="mt-1 p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          value={user.firstName}
          readOnly
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Last Name</label>
        <input
          type="text"
          className="mt-1 p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          value={user.lastName}
          readOnly
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Email</label>
        <input
          type="email"
          className="mt-1 p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          value={user.email}
          readOnly
        />
      </div>
    </div>
  );
};

export default UserProfile;
