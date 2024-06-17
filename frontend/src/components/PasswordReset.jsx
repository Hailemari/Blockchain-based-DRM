import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useResetPasswordMutation } from "../services/authApi"; // Adjust the path as necessary
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const ResetPassword = () => {
  const [values, setValues] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const resetToken = location.pathname.split("/")[2];

  const [resetPassword, { isLoading, isSuccess, isError, error }] = useResetPasswordMutation();

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message || "An error occurred");
    } else if (isSuccess) {
      toast.success("Password reset successfully");
      navigate("/signin");
    }
  }, [isSuccess, isError, error, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Password length validation
    if (values.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    // Password match validation
    if (values.password !== values.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    resetPassword({ resetToken, password: values.password });
  };

  const togglePasswordVisibility = (type) => {
    if (type === "password") {
      setShowPassword((prev) => !prev);
    } else if (type === "confirmPassword") {
      setShowConfirmPassword((prev) => !prev);
    }
  };

  const onChange = (e) => {
    setValues((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900">Reset Password</h1>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                 New Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="off"
                    required
                    minLength={8}
                    value={values.password}
                    onChange={onChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter Password"
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </div>
                </div>
                {values.password.length > 0 && values.password.length < 8 && (
                  <p className="mt-2 text-sm text-red-600">Password must be at least 8 characters long</p>
                )}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="off"
                    required
                    minLength={8}
                    value={values.confirmPassword}
                    onChange={onChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Confirm Password"
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </div>
                </div>
                {values.confirmPassword.length > 0 && values.confirmPassword !== values.password && (
                  <p className="mt-2 text-sm text-red-600">Passwords do not match</p>
                )}
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword;
