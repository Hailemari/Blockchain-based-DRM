import { useEffect } from 'react';
import { useGetUsersQuery, useRemoveUserMutation } from '../services/authApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageUsers = () => {
  const { data: users, error, isLoading, refetch } = useGetUsersQuery();
  const [removeUser] = useRemoveUserMutation();

  useEffect(() => {
    if (error) {
      console.error('Error fetching users:', error);
      toast.error('Error fetching users. Please try again.');
    }
  }, [error]);

  const handleRemoveUser = async (userId) => {
    try {
      await removeUser(userId).unwrap();
      toast.success('User removed successfully!');
      refetch(); 
    } catch (error) {
      console.error('Error removing user:', error);
      toast.error('Error removing user. Please try again.');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Manage Users</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users && users.length > 0 ? (
          users.map(user => (
            <div key={user._id} className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-lg shadow-lg transition-transform transform hover:-translate-y-1 hover:shadow-xl">
              <h3 className="text-xl font-bold mb-2 text-center">{user.firstName} {user.lastName}</h3>
              <p className="text-gray-600 mb-4 text-center">{user.email}</p>
              <div className="flex justify-center mt-4">
                <button
                  className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition duration-300"
                  onClick={() => handleRemoveUser(user._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No users available.</p>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
