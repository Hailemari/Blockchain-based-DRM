// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import FormInput from "./FormInput";
// import { useForgotPasswordMutation } from "../services/authApi"; // Adjust the path as necessary

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const navigate = useNavigate();
//   const [forgotPassword, { isLoading, isSuccess, isError, error }] = useForgotPasswordMutation();

//   useEffect(() => {
//     if (isError) {
//       toast.error(error?.data?.message || "An error occurred");
//     } else if (isSuccess) {
//       toast.success("Reset password link sent successfully");
//       navigate("/");
//     }
//   }, [isSuccess, isError, error, navigate]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     forgotPassword({ email });
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-6 sm:rounded-lg sm:px-10">
//           <h1 className="text-3xl font-extrabold text-gray-900 text-center">Forgot Password</h1>
//           <p className="mt-2 text-sm text-gray-600 text-center">
//             Please enter the email address you registered your account with. We will send you the reset password link to this email.
//           </p>
//           <form onSubmit={handleSubmit} className="mt-8 space-y-6">
//             <FormInput
//               id="email"
//               type="email"
//               label="Email"
//               placeholder="Enter your email"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               pattern="^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$"
//               errorMessage="Please enter a valid email address"
//             />
//             <div>
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
//               >
//                 {isLoading ? 'Sending...' : 'Send Email'}
//               </button>
//             </div>
//           </form>
//           <div className="mt-6 text-center">
//             <span className="text-sm text-gray-600">
//               Remember your password?{" "}
//               <Link to="/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
//                 Sign in
//               </Link>
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import FormInput from "./FormInput";
import { useForgotPasswordMutation } from "../services/authApi"; 
import { Link } from "react-router-dom";
import ConfirmMailSent from "./confirmationMailSent";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [forgotPassword, { isLoading, isSuccess, isError, error }] = useForgotPasswordMutation();

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message || "An error occurred");
    } else if (isSuccess) {
      setShowConfirmation(true);
    }
  }, [isSuccess, isError, error]);

  const inputs = [
    {
      id: 1,
      name: "email",
      type: "email",
      placeholder: "Email",
      label: "Email",
      required: true,
      pattern: "^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$",
      errormessage: "It should be a valid email",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    forgotPassword({ email });
  };

  if (showConfirmation) {
    return (
      <ConfirmMailSent
        imgSrc="../../Assets/img/mail.png"
        msg="Password Reset Instructions Sent"
        p1="Please check your inbox for an email with instructions on how to reset your password."
        p2="If you don't see the email, make sure to check your spam or junk folder."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900">Forgot Password</h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please enter the email address you registered your account with. We will send you the reset password link to this email.
        </p>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {inputs.map((input) => (
                <FormInput
                  key={input.id}
                  {...input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                />
              ))}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? 'Sending...' : 'Send Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-6 text-center">
          <span className="text-sm text-gray-600">
            Want to login? <Link to="/signin" className="font-medium text-indigo-600 hover:text-indigo-500">Login</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
