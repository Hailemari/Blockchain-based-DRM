import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../Hooks/useAuth';

const AuthHandler = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, userType } = useAuth();

  useEffect(() => {
    if (!loading) {

      if (!userType) {
        navigate('/signin', { replace: true });
      } else if (userType) {
        switch (userType) {
          case 'Creator':
            navigate('/creator_dashboard', { replace: true });
            break;
          case 'Consumer':
            navigate('/consumer_dashboard', { replace: true });
            break;
          case 'Admin':
            navigate('/admin-dashboard', { replace: true });
            break;
          default:
            navigate('/signin', { replace: true });
        }
      } 
    }
  }, [loading, userType, navigate, location.pathname]);

  return loading ? <div>Loading...</div> : children;
};

AuthHandler.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthHandler;
