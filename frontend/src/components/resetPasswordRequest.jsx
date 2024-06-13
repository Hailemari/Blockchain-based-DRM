
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export const OTP = () => {
//     const [email, setEmail] = useState('');
//     const navigate = useNavigate();

//     const handleOTP = () => {
//         if (email) {
//             navigate('/verify-otp');
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500">
//             <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full transform transition-all duration-300 hover:scale-105">
//                 <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Reset Password</h2>
//                 <p className="text-center text-gray-600 mb-8">
//                     Please enter your email. We will send you a link to reset your password.
//                 </p>
//                 <div className="flex flex-col space-y-4">
//                     <input
//                         type="email"
//                         placeholder="Email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         className="border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <button
//                         onClick={handleOTP}
//                         className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition duration-200"
//                     >
//                         Reset Password
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

