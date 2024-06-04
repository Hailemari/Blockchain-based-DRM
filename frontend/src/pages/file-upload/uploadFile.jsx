import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';

const FileUploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileDetails, setFileDetails] = useState({
    fileType: '',
    title: '',
    owner: '',
    dateCreated: '',
    description: '',
    permissions: 'Public', // Default permission
    price: '',
    paymentOption: '',
    viewOnly: false,
    share: false,
    download: false,
    externalShare: false,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setErrorMessage('');
      setCurrentStep(2); // Move to the next step after file selection
    } else {
      setSelectedFile(null);
      setErrorMessage('No file selected. Please try again.');
    }
  };

  const handleFileDetailsChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFileDetails((prevDetails) => ({
      ...prevDetails,
      [name]: newValue,
    }));
  };

  const handleDateChange = (date) => {
    setFileDetails((prevDetails) => ({
      ...prevDetails,
      dateCreated: date,
    }));
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setErrorMessage('No file selected. Please choose a file to upload.');
      return;
    }

    // Implement your file upload logic here
    console.log('Uploading file:', selectedFile);
    console.log('File details:', fileDetails);
    // Simulate file upload steps
    setCurrentStep(4); // Move to the next step (uploading)
    setTimeout(() => {
      setCurrentStep(5); // Move to the next step (completed)
      setSelectedFile(null);
      setFileDetails({
        fileType: '',
        title: '',
        owner: '',
        dateCreated: '',
        description: '',
        permissions: 'Public',
        price: '',
        paymentOption: '',
        viewOnly: false,
        share: false,
        download: false,
        externalShare: false,
      });
      setErrorMessage('');
      alert('File uploaded successfully!');
    }, 2000); // Simulate a 2-second upload time
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="container mx-auto">
        <nav className="bg-gray-700 text-white p-4">
          <div className="container mx-auto">
            <p className="text-lg font-bold text-center">Upload File</p>
          </div>
        </nav>
        <div className="m-8 bg-white shadow-md rounded-md p-8">
          {/* Progress Bar */}
          <div className="w-full flex justify-center mb-8">
            <div className="w-3/4 md:w-1/2 lg:w-1/3 flex items-center justify-between">
              <div className="flex-1 flex items-center relative">
                {[1, 2, 3, 4, 5].map((step, index) => (
                  <React.Fragment key={step}>
                    {index !== 0 && (
                      <div className={`flex-1 h-1 ${step <= currentStep ? 'bg-blue-500' : 'bg-gray-300'}`} />
                    )}
                    <div className={`h-4 w-4 rounded-full ${step <= currentStep ? 'bg-blue-500' : 'bg-gray-300'} flex items-center justify-center text-white font-semibold absolute`} style={{ left: `${(index * 100) / 4}%`, transform: 'translateX(-50%)' }}>
                      {/* Circle without number */}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {currentStep === 1 && (
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-4 text-center">File Upload</h2>
              <label htmlFor="file-upload" className="flex flex-col items-center space-y-2 bg-gray-200 rounded-md px-8 py-6 cursor-pointer hover:bg-gray-300">
                <div className="flex items-center">
                  <div className="mr-4">
                    <FontAwesomeIcon icon={faCloudUploadAlt} className="h-12 w-12 text-gray-600" />
                  </div>
                  <div>
                    <span className="text-lg font-semibold">Choose a file</span>
                  </div>
                </div>
                <input type="file" id="file-upload" onChange={handleFileChange} className="hidden" />
              </label>
              {selectedFile && <p className="mt-4 text-sm text-gray-700">Selected file: {selectedFile.name}</p>}
              {errorMessage && <p className="mt-4 text-sm text-red-600">{errorMessage}</p>}
              <button
                onClick={handleNext}
                className="mt-4 bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
              >
                Next
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="mt-8 flex justify-center">
              <div className="w-full max-w-4xl">
                <h2 className="text-2xl font-bold mb-4 text-center">File Details</h2>
                <div className="flex">
                  <div className="w-1/2 pr-4">
                    <div className="mb-4 flex items-center">
                      <label htmlFor="file-type" className="block text-sm font-medium text-gray-700 mr-2">
                        File Type
                      </label>
                      <select
                        id="file-type"
                        name="fileType"
                        value={fileDetails.fileType}
                        onChange={handleFileDetailsChange}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                      >
                        <option value="">Select File Type</option>
                        <option value="image">Image</option>
                        <option value="document">Document</option>
                        <option value="video">Video</option>
                      </select>
                    </div>
                  </div>
                  <div className="w-1/2 pl-4">
                    <div className="mb-4 flex items-center">
                      <label htmlFor="file-name" className="block text-sm font-medium text-gray-700 mr-2">
                        Title
                      </label>
                      <input
                        type="text"
                        id="file-name"
                        name="title"
                        value={fileDetails.title}
                        onChange={handleFileDetailsChange}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                      />
                    </div>
                    <div className="mb-4 flex items-center">
                      <label htmlFor="file-owner" className="block text-sm font-medium text-gray-700 mr-2">
                        Owner
                      </label>
                      <input
                        type="text"
                        id="file-owner"
                        name="owner"
                        value={fileDetails.owner}
                        onChange={handleFileDetailsChange}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                      />
                    </div>
                    <div className="mb-4 flex items-center">
                      <label htmlFor="file-date-created" className="block text-sm font-medium text-gray-700 mr-2">
                        Date Created
                      </label>
                      <input
                        type="date"
                        id="file-date-created"
                        name="dateCreated"
                        value={fileDetails.dateCreated}
                        onChange={(e) => handleDateChange(e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                      />
                    </div>
                    <div className="mb-4 flex items-center">
                      <label htmlFor="file-description" className="block text-sm font-medium text-gray-700 mr-2">
                        Description
                      </label>
                      <textarea
                        id="file-description"
                        name="description"
                        value={fileDetails.description}
                        onChange={handleFileDetailsChange}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={handleBack}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="mt-8 flex justify-center">
              <div className="w-full max-w-4xl">
                <h2 className="text-2xl font-bold mb-4 text-center">Payment and Permissions</h2>
                <div className="mb-4 flex justify-between items-center">
                  <div className="flex-1">
                    <label htmlFor="file-price" className="block text-sm font-medium text-gray-700 mr-2">
                      Set Price
                    </label>
                    <input
                      type="text"
                      id="file-price"
                      name="price"
                      value={fileDetails.price}
                      onChange={handleFileDetailsChange}
                      className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    />
                  </div>
                  <div className="flex-1 ml-4">
                    <label htmlFor="payment-option" className="block text-sm font-medium text-gray-700 mr-2">
                      Payment Option
                    </label>
                    <select
                      id="payment-option"
                      name="paymentOption"
                      value={fileDetails.paymentOption}
                      onChange={handleFileDetailsChange}
                      className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    >
                      <option value="">Select Payment Option</option>
                      <option value="credit">Credit Card</option>
                      <option value="paypal">PayPal</option>
                      <option value="crypto">Cryptocurrency</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="block text-sm font-medium text-gray-700 mb-2">Permissions</p>
                  <div className="flex flex-col items-end mr-4">
  <div className="flex items-center mb-2">
    <input
      type="checkbox"
      id="view-only"
      name="viewOnly"
      checked={fileDetails.viewOnly}
      onChange={handleFileDetailsChange}
    />
    <label htmlFor="view-only" className="block text-sm text-gray-700 ml-2">
      View Only
    </label>
  </div>
  <div className="flex items-center mb-2">
    <input
      type="checkbox"
      id="share"
      name="share"
      checked={fileDetails.share}
      onChange={handleFileDetailsChange}
    />
    <label htmlFor="share" className="block text-sm text-gray-700 ml-2">
      Share
    </label>
  </div>
  <div className="flex items-center mb-2">
    <input
      type="checkbox"
      id="download"
      name="download"
      checked={fileDetails.download}
      onChange={handleFileDetailsChange}
    />
    <label htmlFor="download" className="block text-sm text-gray-700 ml-2">
      Download
    </label>
  </div>
  <div className="flex items-center mb-2">
    <input
      type="checkbox"
      id="external-share"
      name="externalShare"
      checked={fileDetails.externalShare}
      onChange={handleFileDetailsChange}
    />
    <label htmlFor="external-share" className="block text-sm text-gray-700 ml-2">
      External Share
    </label>
  </div>
</div>


                </div>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={handleBack}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="mt-8 text-center">
              <p className="text-lg font-bold">Uploading...</p>
            </div>
          )}

          {currentStep === 5 && (
            <div className="mt-8 text-center">
              <p className="text-lg font-bold">Upload Completed!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploadPage;
