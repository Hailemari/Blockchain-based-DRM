// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FcReadingEbook } from "react-icons/fc";
// import { BsPersonVideo3 } from "react-icons/bs";

// export const NewUserScreen = () => {
//   const [userType, setUserType] = useState("Creator");
//   const navigate = useNavigate();
//   return (
//     <>
//       <div className="container mx-auto p-4">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold mb-4">
//             Join as Content creator or content consumer
//           </h1>
//         </div>
//         <div className="flex justify-center mt-10">
//   <div className="grid grid-cols-2 gap-4">
//     {/* Creator Card */}
//     <div className="max-w-sm rounded overflow-hidden shadow-lg">
//       <div className="px-6 py-4 flex flex-col items-center">
//         <div className="w-full flex justify-between items-start">
//           <span className="font-bold text-xl mb-2">
//             {/* Assuming you have imported BsPersonVideo3 */}
//             <BsPersonVideo3 />
//           </span>
//           <label>
//             <input
//               type="radio"
//               value="Creator"
//               checked={userType === "Creator"}
//               onChange={() => setUserType("Creator")}
//               className="form-radio h-5 w-5 text-green-500" // Change color to green
//             />
//           </label>
//         </div>
//         <p className="text-gray-700 text-base">
//           Create and share your Books and other resources
//         </p>
//       </div>
//     </div>

//     <div className="max-w-sm rounded hover:border border-spacing-2 border-green-500  overflow-hidden shadow-lg">
//       <div className="px-6 py-4 flex flex-col items-center">
//         <div className="w-full flex justify-between items-start">
//           <div className="font-bold text-xl mb-2">
//             <FcReadingEbook />
//           </div>
//           <label className="text-green-500">
//             <input 
//               type="radio"
//               value="User"
//               checked={userType === "User"}
//               onChange={() => setUserType("User")}
//               className="h-5 w-5 text-green-500" // Change color to green
//             />
//           </label>
//         </div>
//         <p className="text-gray-700 text-base">
//           Join as User and explore the content and other resources
//         </p>
//       </div>
//     </div>
//   </div>
// </div>

//       </div>
      // <div className="text-center p-4">
      //   <button
      //     className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      //     onClick={() => {
      //       navigate(`/register?role=${userType}`);
      //     }}
      //   >
      //     {`Register as ${userType}`}
      //   </button>
      // </div>
//     </>
//   );
// };

import React, { useState } from "react";
import { BsPersonVideo3 } from 'react-icons/bs';
import { FcReadingEbook } from 'react-icons/fc';
import UserCard from "../components/newUserCard";
import { Link,useNavigate } from "react-router-dom";

export const NewUserScreen = () => {
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="container mx-auto ">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">
          Join as Content creator or content consumer
        </h1>
      </div>
      <div className="grid grid-cols-2 gap-4">
      
        <UserCard
          icon={<BsPersonVideo3 />}
          userType="Creator"
          selectedUserType={userType}
          setUserType={setUserType}
          description="Create and share your Books and other resources"
        />

        <UserCard
          icon={<FcReadingEbook />}
          userType="User"
          selectedUserType={userType}
          setUserType={setUserType}
          description="Join as User and explore the content and other resources"
        />
      </div>

      <div className="text-center p-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            navigate(`/register?role=${userType}`);
          }}
        >
          {userType ? `Register as ${userType}` : "Select Account type"}
        </button>
      </div>
      <p className=" flex justify-center items-center "> Already have an account ?<Link to="/signin" className="text-green-600 ml-1 hover:underline"> Signin</Link></p>
    </div>
  );
};

