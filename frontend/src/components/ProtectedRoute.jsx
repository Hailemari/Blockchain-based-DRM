import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

import useAuth from '../Hooks/useAuth';

const ProtectedRoute = ({ element }) => {
  const { loading, userType } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userType) {
    return <Navigate to="/" />;
  }

  return element;
};

ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export default ProtectedRoute;
