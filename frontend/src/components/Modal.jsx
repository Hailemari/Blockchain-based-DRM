import PropTypes from 'prop-types';
const Modal = ({ onClose, contentTypes }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-md">
                <h1 className="text-2xl font-bold">Choose Content Type</h1>
                <div className="flex justify-between">
                    {contentTypes.map((type, index) => (
                        <button key={index} className="bg-blue-500 text-white px-4 py-2 rounded-md">{type}</button>
                    ))}
                </div>
                <button onClick={onClose} className="text-gray-600 mt-4">
                    Cancel
                </button>
            </div>
        </div>
    );
}


export default Modal;

Modal.propTypes = {
    onClose: PropTypes.func,
    contentTypes: PropTypes.array,
};
