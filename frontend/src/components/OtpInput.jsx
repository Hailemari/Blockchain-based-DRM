import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

export const OTPInput = ({ onChange, value }) => {
    const navigate = useNavigate();

    const handleVerifyAccount = () => {
        // Perform verification logic here

        // Redirect to password reset page
        navigate('/reset-password');
    };

    const handleResendOTP = () => {
        // Resend OTP logic here
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 border rounded-md shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
            <p>OTP Sent to email</p>
            <div className="flex flex-col mt-4">
                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={value}
                    onChange={onChange}
                    className="border border-gray-300 rounded-md px-3 py-2 mb-2"
                />
                <div>
                    <button onClick={handleVerifyAccount} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">Verify Account</button>
                    <button onClick={handleResendOTP} className="bg-blue-500 text-white px-4 py-2 rounded-md">Resend OTP</button>
                </div>
            </div>
        </div>
    );
};


OTPInput.propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
};
