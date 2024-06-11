import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode"
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const [authState, setAuthState] = useState({ loading: true, userType: null });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userType = localStorage.getItem('userType');

    if (!token || !userType) {
      setAuthState({ loading: false, userType: null });
    } else {
      try {
        const decodedToken = jwtDecode(token); 
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userType');
          setAuthState({ loading: false, userType: null });
          navigate('/signin');
        } else {
          setAuthState({ loading: false, userType });
        }
      } catch (error) {
        // Invalid token
        localStorage.removeItem('authToken');
        localStorage.removeItem('userType');
        setAuthState({ loading: false, userType: null });
        navigate('/signin');
      }
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    setAuthState({ loading: false, userType: null });
    navigate('/signin');
  };

  return { ...authState, logout };
};

export default useAuth;
