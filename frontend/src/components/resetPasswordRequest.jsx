import { useState } from "react";
import { useNavigate } from "react-router-dom";


export const OTP = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleOTP = () => {
        // Perform reset password request logic here
        if (email) {
            // Redirect user to OTP input page
            // Replace the following line with your desired redirect logic
            navigate('/verify-otp')
            ;
        }
    };

    return (
        <div className='flex justify-center p-4'>
            <div className="rounded-md bg-gray-200 mt-5 p-3">
                <h2 className="text-2xl font-bold mb-4">Request OTP </h2>
                <p>Enter your Email we will send otp code </p>  
                <div className="flex flex-col">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 mb-2"
                    />
                 
                    <div>
                        <button onClick={handleOTP} className="bg-gradient-to-r from-blue-700 to-purple-700 text-white px-4 py-2 rounded-md">Send OTP</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
