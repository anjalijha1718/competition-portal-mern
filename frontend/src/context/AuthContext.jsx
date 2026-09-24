import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('feedants_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('feedants_token');
      const storedUser = localStorage.getItem('feedants_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          // Refresh user profile in background
          const res = await authAPI.getMe();
          if (res?.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('feedants_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('[Auth] Session expired or invalid, logging out:', err.message);
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res?.data) {
      const { token: receivedToken, user: receivedUser } = res.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('feedants_token', receivedToken);
      localStorage.setItem('feedants_user', JSON.stringify(receivedUser));
      return receivedUser;
    }
  };

  const register = async (userData) => {
    const res = await authAPI.register(userData);
    if (res?.data) {
      const { token: receivedToken, user: receivedUser } = res.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('feedants_token', receivedToken);
      localStorage.setItem('feedants_user', JSON.stringify(receivedUser));
      return receivedUser;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('feedants_token');
    localStorage.removeItem('feedants_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
