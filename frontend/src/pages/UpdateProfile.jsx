// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useUpdateProfileMutation,useGetUserQuery } from '../services/authApi';
// import useAuth from '../Hooks/useAuth';

// const UpdateProfile = () => {
//   const { user, loading } = useAuth();
//   const [formState, setFormState] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//   });
//   const [errors, setErrors] = useState({});
//   const [alert, setAlert] = useState({ message: '', type: '' });
//   const navigate = useNavigate();
//   const [updateProfile, { isLoading }] = useUpdateProfileMutation();

//   useEffect(() => {
//     if (user) {
//       setFormState({
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//       });
//     }
//   }, [user]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormState((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const validateInputs = () => {
//     const newErrors = {};
//     if (!formState.firstName.trim()) {
//       newErrors.firstName = 'First Name is required';
//     }
//     if (!formState.lastName.trim()) {
//       newErrors.lastName = 'Last Name is required';
//     }
//     if (!formState.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
//       newErrors.email = 'Invalid email format';
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateInputs()) {
//       return;
//     }
//     try {
//       await updateProfile(formState).unwrap();
//       setAlert({ message: 'Profile updated successfully!', type: 'success' });
//     } catch (error) {
//       if (error.status === 409) {
//         setAlert({ message: 'Email already exists. Please use a different email.', type: 'error' });
//       } else {
//         setAlert({ message: 'Failed to update profile', type: 'error' });
//       }
//     }
//   };

//   if (loading || isLoading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
//       <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Update Profile</h2>
//       {alert.message && (
//         <div className={`p-4 mb-4 text-sm text-${alert.type === 'success' ? 'green' : 'red'}-700 bg-${alert.type === 'success' ? 'green' : 'red'}-100 rounded-lg`}>
//           {alert.message}
//         </div>
//       )}
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-2 gap-4">
//           <div className="mb-4">
//             <label className="block text-gray-700 font-medium">First Name</label>
//             <input
//               type="text"
//               name="firstName"
//               className="mt-1 p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
//               value={formState.firstName}
//               onChange={handleChange}
//             />
//             {errors.firstName && (
//               <p className="text-red-500 mt-2">{errors.firstName}</p>
//             )}
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 font-medium">Last Name</label>
//             <input
//               type="text"
//               name="lastName"
//               className="mt-1 p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
//               value={formState.lastName}
//               onChange={handleChange}
//             />
//             {errors.lastName && (
//               <p className="text-red-500 mt-2">{errors.lastName}</p>
//             )}
//           </div>
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium">Email</label>
//           <input
//             type="email"
//             name="email"
//             className="mt-1 p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
//             value={formState.email}
//             onChange={handleChange}
//           />
//           {errors.email && (
//             <p className="text-red-500 mt-2">{errors.email}</p>
//           )}
//         </div>
//         <button
//           type="submit"
//           className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//         >
//           Save
//         </button>
//       </form>
//     </div>
//   );
// };

// export default UpdateProfile;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateProfile = () => {
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        const response = await axios.get('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFormState({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setAlert({ message: 'Failed to fetch profile', type: 'error' });
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateInputs = () => {
    const newErrors = {};
    if (!formState.firstName.trim()) {
      newErrors.firstName = 'First Name is required';
    }
    if (!formState.lastName.trim()) {
      newErrors.lastName = 'Last Name is required';
    }
    if (!formState.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = 'Invalid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) {
      return;
    }
    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      await axios.put('http:localhost:5000/auth/update-profile', formState, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAlert({ message: 'Profile updated successfully!', type: 'success' });
    } catch (error) {
      if (error.response?.status === 409) {
        setAlert({ message: 'Email already exists. Please use a different email.', type: 'error' });
      } else {
        setAlert({ message: 'Failed to update profile', type: 'error' });
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Update Profile</h2>
      {alert.message && (
        <div className={`p-4 mb-4 text-sm text-${alert.type === 'success' ? 'green' : 'red'}-700 bg-${alert.type === 'success' ? 'green' : 'red'}-100 rounded-lg`}>
          {alert.message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">New First Name</label>
            <input
              type="text"
              name="firstName"
              className="mt-1 p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formState.firstName}
              onChange={handleChange}
            />
            {errors.firstName && (
              <p className="text-red-500 mt-2">{errors.firstName}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">New Last Name</label>
            <input
              type="text"
              name="lastName"
              className="mt-1 p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formState.lastName}
              onChange={handleChange}
            />
            {errors.lastName && (
              <p className="text-red-500 mt-2">{errors.lastName}</p>
            )}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">New Email</label>
          <input
            type="email"
            name="email"
            className="mt-1 p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            value={formState.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 mt-2">{errors.email}</p>
          )}
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
