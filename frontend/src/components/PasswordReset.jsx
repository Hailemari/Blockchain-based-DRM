import  { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const PasswordReset = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);

  const navigate = useNavigate();

  const handlePasswordReset = () => {
    try {
      // I will do password reset logic here

      if (passwordMatch && passwordValid) {
        navigate("/signin");
      }
    } catch (error) {
      console.error("Error resetting password", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const validatePassword = (value) => {
    if (value === "" || value.length < 6) {
      setPasswordValid(false);
    } else {
      setPasswordValid(true);
    }

    setPassword(value);
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    setPasswordMatch(value === password);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
      <div className="rounded-lg bg-gray-50 p-4">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">
          Password Reset
        </h2>
        <div className="">
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => validatePassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10"
            />
            <div
              className="absolute inset-y-0 right-3 flex items-center text-lg cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </div>
          </div>
          <div className="relative mb-4">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10"
            />
            <div
              className="absolute inset-y-0 right-3 flex items-center text-lg cursor-pointer"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </div>
          </div>
          {!passwordMatch && (
            <p className="text-red-500">Passwords do not match</p>
          )}
          {!passwordValid && (
            <p className="text-red-500">
              Password must be at least 6 characters long
            </p>
          )}
          <button
            onClick={handlePasswordReset}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-2 rounded-lg transition duration-150 ease-in-out"
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
