import { useState } from 'react';
export const UploadContent = () => {
    const [selectedOption, setSelectedOption] = useState('');

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle the upload based on the selected option
        console.log('Selected Option:', selectedOption);
        // Add your upload logic here
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    <input
                        type="radio"
                        value="ebook"
                        checked={selectedOption === 'ebook'}
                        onChange={handleOptionChange}
                    />
                    Ebook
                </label>
                <label>
                    <input
                        type="radio"
                        value="video"
                        checked={selectedOption === 'video'}
                        onChange={handleOptionChange}
                    />
                    Video
                </label>
                <label>
                    <input
                        type="radio"
                        value="music"
                        checked={selectedOption === 'music'}
                        onChange={handleOptionChange}
                    />
                    Music
                </label>
                <button type="submit">Upload</button>
            </form>
        </div>
    );
};