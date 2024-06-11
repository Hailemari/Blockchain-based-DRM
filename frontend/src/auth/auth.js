
export const isAuthenticated = () => {
    return !!localStorage.getItem('authToken'); 
  };
  
  export const getUserType = () => {
    return localStorage.getItem('userType');
  };
  