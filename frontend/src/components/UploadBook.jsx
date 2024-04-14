// import { BiCloudUpload } from "react-icons/bi";
// import { useState } from "react";
// import { Link } from "react-router-dom";

// export const UploadBook = () => {
//     const [step, setStep] = useState(1);
//     const steps = [
//       {
//         label: 'Upload File',
//         step: 1,
//       },
//       {
//         label: 'File Information',
//         step: 2,
//       },
//       {
//         label: 'Payment method',
//         step: 3,
//       },
//       {
//         label: 'Publish',
//         step: 4,
//       },
//     ];

//     const handleNext = () => {
//         setStep((prevStep) => prevStep + 1);
//     };

//     const handleBack = () => {
//         setStep((prevStep) => prevStep - 1);
//     };

//     const width = `${(100 / (steps.length - 1)) * (step - 1)}%`;

//     return (
//         <div className="flex justify-center">
//             {/* progress indicator */}
//             <div className="flex justify-center items-center relative">
//                 {/* Line to connect circles */}
//                 <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2">
//                     <div className="absolute top-1/2 left-0 bg-blue-500 h-0.5 w-full"></div>
//                 </div>
//                 {/* Line to indicate progress */}
//                 <div className="absolute top-1/2 left-0 bg-blue-500 h-0.5 transition ease-in-out duration-400" style={{ width: width }}></div>

//                 {steps.map((s, index) => (
//                     <div key={s.step} className={`bg-blue-500 text-white p-2 rounded-full ${step >= s.step ? 'bg-blue-500' : 'bg-gray-300'}`}>
//                         <div className="w-4 h-4 rounded-full bg-white"></div>
//                         {step > s.step && <span className="text-white text-lg md:text-base">{s.label}</span>}
//                     </div>
//                 ))}
//             </div>

//             <div className="top-1/2">
//                 {step === 1 && <StepOne handleNext={handleNext} />}
//                 {step === 2 && <StepTwo handleNext={handleNext} handleBack={handleBack} />}
//                 {step === 3 && <StepThree handleNext={handleNext} handleBack={handleBack} />}
//                 {step === 4 && <StepFour handleNext={handleNext} handleBack={handleBack} />}
//             </div>
//         </div>
//     );
// };

// const StepOne = ({ handleNext }) => {
//     return (
//         <div className="flex justify-center items-center h-screen">
//             <div className="text-blue-500 text-6xl">
//                 <BiCloudUpload />
//             </div>
//             <input type="file" />
//             <button onClick={handleNext}>Next</button>
//         </div>
//     );
// };

// const StepTwo = ({ handleNext, handleBack }) => {
//     return (
//         <div>
//             <form>
//                 <input type="text" placeholder="Book Title" />
//                 <input type="text" placeholder="Author" />
//                 <input type="text" placeholder="Description" />
//             </form>
//             <button onClick={handleBack}>Back</button>
//             <button onClick={handleNext}>Next</button>
//         </div>
//     );
// };

// const StepThree = ({ handleNext, handleBack }) => {
//     return (
//         <div>
//             <form>
//                 <input type="text" placeholder="Price" />
//                 <input type="text" placeholder="Discount" />
//                 <input type="text" placeholder="Category" />
//             </form>
//             <button onClick={handleBack}>Back</button>
//             <button onClick={handleNext}>Next</button>
//         </div>
//     );
// };

// const StepFour = ({ handleNext, handleBack }) => {
//     return (
//         <div>
//             <form>
//                 <input type="text" placeholder="Tags" />
//                 <input type="text" placeholder="Language" />
//                 <input type="text" placeholder="Pages" />
//             </form>
//             <button onClick={handleBack}>Back</button>
//             <button onClick={handleNext}>Next</button>
//         </div>
//     );
// };
import React, { useState } from 'react';

export const UploadBook = () => {
    const [activeStep, setActiveStep] = useState(0);
  
    const handleNext = () => {
      setActiveStep((prevStep) => Math.min(prevStep + 1, 3)); // Assuming there are 4 steps (0-based index)
    };
  
    const handleBack = () => {
      setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
    };
  
    return (
      <div className="flex flex-col items-center">
        {/* Step Progress Bar */}
        <div className="relative w-96 mt-8">
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full h-0.5 bg-gray-200"></div>
          <div
            className={`absolute top-1/2 left-0 transform -translate-y-1/2 h-0.5 rounded-full bg-blue-500 transition-width duration-300 ease-in-out ${
              activeStep === 0 ? 'w-1/4' : activeStep === 1 ? 'w-2/4' : activeStep === 2 ? 'w-3/4' : 'w-full'
            }`}
          ></div>
        </div>
        {/* Step Labels */}
        <div className="flex mt-4 space-x-16">
          {['Step 1', 'Step 2', 'Step 3', 'Step 4'].map((label, index) => (
            <div key={label} className={`relative text-center ${index === activeStep ? 'text-blue-500 font-bold' : 'text-gray-500'}`}>
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">{index + 1}</span>
              {label}
              {index < activeStep ? (
                <>
                  <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full h-0.5 bg-green-500"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 0a10 10 0 110 20 10 10 0 010-20zm4.95 7.97a.75.75 0 00-1.08-1.04L8.75 11.71 6.08 9.04a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l6.25-6.25a.75.75 0 00.02-1.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </>
              ) : null}
            </div>
          ))}
        </div>
        {/* Step Content */}
        <div className="mt-4">
          {activeStep === 0 && <h1>Step 1 Content</h1>}
          {activeStep === 1 && <h1>Step 2 Content</h1>}
          {activeStep === 2 && <h1>Step 3 Content</h1>}
          {activeStep === 3 && <h1>Step 4 Content</h1>}
        </div>
        {/* Navigation Buttons */}
        <div className="mt-4">
          <button
            disabled={activeStep === 0}
            onClick={handleBack}
            className={`bg-blue-500 text-white px-4 py-2 ${activeStep === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Back
          </button>
          <button
            disabled={activeStep === 3}
            onClick={handleNext}
            className={`bg-blue-500 text-white px-4 py-2 ${activeStep === 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Next
          </button>
        </div>
      </div>
    );
  };
  