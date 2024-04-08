import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSearchResults } from '../services/searchSlice'; 
import PropTypes from 'prop-types';
/**
 * Search component for filtering elements based on user input.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.onClose - Callback function to close the search overlay.
 * @returns {JSX.Element} The rendered Search component.
 */
const Search = ({ onClose }) => {
    const [searchValue, setSearchValue] = useState('');
    const dispatch = useDispatch(); // Use Redux's useDispatch hook to dispatch actions

    const handleSearchChange = (event) => {
        setSearchValue(event.target.value);
    };

    const handleSearchSubmit = async (event) => {
        event.preventDefault();

        const searchValueLower = searchValue.toLowerCase();
        const results = [];

        // Assuming you have a better way to reference the searchable elements
        const elements = document.querySelectorAll('[data-searchable]');

        elements.forEach((element) => {
            const text = element.textContent.toLowerCase();
            if (text.includes(searchValueLower)) {
                results.push({
                    text: element.textContent,
                    id: element.id
                });
            }
        });

        // Dispatch the action to update the search results in the global state
        dispatch(setSearchResults(results));
        onClose(); // Close the search overlay
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-4 rounded-md">
                <form onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        value={searchValue}
                        onChange={handleSearchChange}
                        className="border border-gray-300 px-3 py-2 rounded-md w-64"
                        placeholder="Search..."
                    />
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2">
                        Search
                    </button>
                    <button onClick={onClose} type="button" className="text-gray-600 ml-2">
                        close
                    </button>
                </form>
            </div>
        </div>
    );
};

// Add prop type validation for 'onClose'
Search.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default Search;

