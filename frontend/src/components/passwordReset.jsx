import React, { useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom';
const PasswordReset = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);

    const navigate = useNavigate();

    const handlePasswordReset = () => {
        try {
            // Perform password reset logic here
            if (passwordMatch && passwordValid) {
                // Redirect user to login page
                // Replace the following line with your desired redirect logic
                navigate('/signin');
            }
        }
        catch (error) {
            console.error('Error resetting password', error);
        }


    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const validatePassword = (value) => {
        // Add your password validation rules here
        // For example, to check if the password has at least 8 characters
        setPasswordValid(value.length >= 8);
        setPassword(value);
    };

    const handleConfirmPasswordChange = (value) => {
        setConfirmPassword(value);
        setPasswordMatch(value === password);
    };

    return (
        <div className='flex justify-center p-4'>
            <div className="rounded-md bg-gray-200 mt-5 p-3">
                <h2 className="text-2xl font-bold mb-4">Password Reset</h2>
                <div className="">
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => validatePassword(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 mb-2"
                        />
                        <div
                           className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? (
                                <AiFillEyeInvisible />
                            ) : (
                                <AiFillEye />
                            )}
                        </div>
                    </div>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 mb-2 relative"
                        />
                        <div
                           className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer"
                            onClick={toggleConfirmPasswordVisibility}
                        >
                            {showConfirmPassword ? (
                                <AiFillEyeInvisible />
                            ) : (
                                <AiFillEye />
                            )}
                        </div>
                    </div>
                    {!passwordMatch && (
                        <p className="text-red-500">Passwords do not match</p>
                    )}
                    {!passwordValid && (
                        <p className="text-red-500">
                            Password must be at least 8 characters long
                        </p>
                    )}
                    <button
                        onClick={handlePasswordReset}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md"
                    >
                        Reset Password
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PasswordReset;