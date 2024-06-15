import { useState } from "react";
import { BsPersonVideo3 } from 'react-icons/bs';
import { FcReadingEbook } from 'react-icons/fc';
import UserCard from "../components/NewUser";
import { Link, useNavigate } from "react-router-dom";

export const NewUserScreen = () => {
  const [userType, setUserType] = useState("Consumer");
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-800">
          Join as a Content Creator or Content Consumer
        </h1>
      </div>
      <div className="flex justify-center items-center w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-4xl p-4">
          <UserCard
            icon={<BsPersonVideo3 className="text-6xl mx-auto text-blue-600" />}
            userType="Creator"
            selectedUserType={userType}
            setUserType={setUserType}
            description="Create and share your books and other resources"
          />

          <UserCard
            icon={<FcReadingEbook className="text-6xl mx-auto" />}
            userType="Consumer"
            selectedUserType={userType}
            setUserType={setUserType}
            description="Join as a Consumer and explore the content and other resources"
          />
        </div>
      </div>

      <div className="text-center mt-8">
        <button
          className={`bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-l hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3 px-6 rounded transition-all duration-300 transform ${userType ? "hover:scale-105" : "opacity-50 cursor-not-allowed"}`}
          onClick={() => {
            if (userType) {
              navigate(`/register?role=${userType}`);
            }
          }}
          disabled={!userType}
        >
          {userType ? `Register as ${userType}` : "Select Account Type"}
        </button>
      </div>
      <p className="text-center mt-4 text-gray-600">
        Already have an account? <Link to="/signin" className="text-green-500 hover:underline">Sign in</Link>
      </p>
    </div>
  );
};
