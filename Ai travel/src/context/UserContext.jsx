import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, signupUser, logoutUser, getProfile } from '../services/authService';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // On app start — verify token with backend
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('aiTravelToken');
      const savedUser = localStorage.getItem('aiTravelUser');

      if (token && savedUser) {
        try {
          // Verify token is still valid
          const freshUser = await getProfile();
          setUser(freshUser);
          setIsAuthenticated(true);
          localStorage.setItem('aiTravelUser', JSON.stringify(freshUser));
        } catch {
          // Token expired or invalid
          logoutUser();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setAuthLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const userData = await loginUser(email, password);
    setUser(userData);
    setIsAuthenticated(true);
    return userData;
  };

  const signup = async (name, email, phone, password) => {
    const userData = await signupUser(name, email, phone, password);
    setUser(userData);
    setIsAuthenticated(true);
    return userData;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <UserContext.Provider value={{ user, isAuthenticated, authLoading, login, signup, logout }}>
      {children}
    </UserContext.Provider>
  );
};
