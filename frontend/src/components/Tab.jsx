import propTypes from 'prop-types';
const Tab = ({ tabIndex, activeTab, onClick, icon, label, children }) => {
    const isActive = tabIndex === activeTab;

    return (
        <div
            className={`mr-2 p-2 cursor-pointer ${
                isActive ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"
            }`}
            onClick={onClick}
        >
            <div className="flex  items-center space-x-2">
                {icon}
                <span>{label} </span>
            </div>
            {children}
        </div>
    );
};

export default Tab;

Tab.propTypes = {
    tabIndex: propTypes.number,
    activeTab: propTypes.number,
    onClick: propTypes.func,
    icon: propTypes.element,
    label: propTypes.string,
    children: propTypes.node,
};