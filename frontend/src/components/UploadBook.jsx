import { BiCloudUpload } from "react-icons/bi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const StepOne = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="text-blue-500 text-6xl mb-4">
                <BiCloudUpload />
            </div>
            <input 
                type="file" 
                onChange={handleFileChange} 
                accept=".pdf,.epub" 
                className="border rounded p-2"
            />
            {selectedFile && <p className="mt-2">File Selected: {selectedFile.name}</p>}
        </div>
    );
};

const StepTwo = () => {
    return (
        <div className="flex flex-col items-center">
            <form className="w-1/2">
                <input type="text" placeholder="Book Title" className="border rounded p-2 mb-4" required />
                <input type="text" placeholder="Author" className="border rounded p-2 mb-4" required />
                <textarea placeholder="Description" className="border rounded p-2 mb-4 h-32" required></textarea>
            </form>
        </div>
    );
};
const StepThree = () => {
    return (
        <div className="flex items-center">
            <form className="w-1/2">
                <input type="number" placeholder="Price in ETB" className="border rounded p-2 mb-4" min="0" required />
                <input type="number" placeholder="Discount" className="border rounded p-2 mb-4" min="0" max="100" required />
                <select className="border rounded p-2 mb-4" required>
                    <option value="">Payment Method</option>
                    <option value="fiction">Chapa</option>
                    <option value="non-fiction">BitCoin</option>
                </select>
                <div className="flex items-center mb-4">
                    <input type="checkbox" className="mr-2" />
                    <p>View Only</p>
                </div>
                <div className="flex items-center mb-4">
                    <input type="checkbox" className="mr-2" />
                    <p>Shareable</p>
                </div>
                <div className="flex items-center mb-4">
                    <input type="checkbox" className="mr-2" />
                    <p>Download</p>
                </div>
                <div className="flex items-center mb-4">
                    <input type="checkbox" className="mr-2" />
                    <p>External Share</p>
                </div>
            </form>
        </div>
    );
};
const FinalStep = () => {
    const history = useNavigate();

    const handlePublish = () => {
        // Here you can add your logic to publish the book
        // For this example, I'll navigate to the success page
        history('/success');
    };

    return (
        <div className="flex flex-col items-center">
            <button 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handlePublish}
            >
                Publish
            </button>
        </div>
    );
};
export const SuccessPage = () => {
    const history = useNavigate();

    const handleReturn = () => {
        history('/creator-dashboard');
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <p className="text-green-500 mb-4">Book published successfully!</p>
            <button 
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleReturn}
            >
                Return to Dashboard
            </button>
        </div>
    );
};

export const UploadBook = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [isPublished, setIsPublished] = useState(false);
    const navigate = useNavigate();

    const handleNext = () => {
        if (activeStep === 0) {
            const selectedFile = document.querySelector('input[type="file"]').files[0];
            if (!selectedFile) {
                alert('Please select a file.');
                return;
            }
        }
        setActiveStep((prevStep) => Math.min(prevStep + 1, 3));
    };

    const handleBack = () => {
        setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
    };

    const handlePublish = () => {
        setIsPublished(true);
    };

    return (
        <div className="flex flex-col items-center">
            {/* Step Progress Bar */}
            <div className="relative w-96 h-4 bg-gray-200 rounded-full mt-8">
                <div
                    className={`absolute top-0 left-0 h-4 rounded-full bg-blue-500 transition-width duration-300 ease-in-out ${
                        activeStep === 0 ? 'w-1/4' : activeStep === 1 ? 'w-2/4' : activeStep === 2 ? 'w-3/4' : 'w-full'
                    }`}
                ></div>
            </div>
            {/* Step Labels */}
            <div className="flex mt-4 space-x-16">
                {['Select Book', 'Book Information', 'Payment Method and Agreement', 'Publish'].map((label, index) => (
                    <div key={label} className={`text-center ${index === activeStep ? 'text-blue-500 font-bold' : 'text-gray-500'}`}>
                        <span className="mr-2">{index + 1}</span>
                        {label}
                        {index < activeStep ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M10 0a10 10 0 110 20 10 10 0 010-20zm4.95 7.97a.75.75 0 00-1.08-1.04L8.75 11.71 6.08 9.04a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l6.25-6.25a.75.75 0 00.02-1.02z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        ) : null}
                    </div>
                ))}
            </div>
            {/* Step Content */}
            <div className="mt-4">
                {activeStep === 0 && <StepOne />}
                {activeStep === 1 && <StepTwo />}
                {activeStep === 2 && <StepThree />}
                {activeStep === 3 && <FinalStep />}
                {activeStep === 4 && <SuccessPage/>}
            </div>
            {/* Navigation Buttons */}
            <div className="mt-4">
                <button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={`bg-blue-500 text-white px-4 py-2 rounded mr-4 ${activeStep === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    Back
                </button>
                <button
                    disabled={activeStep === 3}
                    onClick={handleNext}
                    className={`bg-blue-500 text-white px-4 py-2 rounded ${activeStep === 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    Next
                </button>
            </div>
            {/* Success Message */}
            {isPublished && <SuccessPage />}
        </div>
    );
};