import{ useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage(response.data.message);
      } catch (error) {
        setMessage('Failed to load admin dashboard');
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>{message}</p>
    </div>
  );
};

export default AdminDashboard;
