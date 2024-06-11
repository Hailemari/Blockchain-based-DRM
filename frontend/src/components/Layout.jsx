
import PropTypes from 'prop-types';
import Sidebar from './Sidebar';

const Layout = ({ contents, children }) => {
  return (
    <div className="flex">
      <Sidebar contents={contents} />
      <div className="flex-1 p-6 bg-gray-100">
        {children}
      </div>
    </div>
  );
};

Layout.propTypes = {
  contents: PropTypes.array.isRequired,
  children: PropTypes.node.isRequired,
};

export default Layout;
