import { createContext, useState, useEffect, useContext } from 'react';
import { clearTokenCache } from '../config/axiosConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setSessionExpired(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    clearTokenCache();
    setIsAuthenticated(false);
  };

  const expireSession = () => {
    clearTokenCache();
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setSessionExpired(true);
  };

  const resetSessionExpired = () => {
    setSessionExpired(false);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        login, 
        logout, 
        expireSession, 
        sessionExpired,
        resetSessionExpired
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);