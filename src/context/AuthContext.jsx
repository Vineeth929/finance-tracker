import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { createAPIClient } from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create API client once
  const apiClient = useMemo(() => createAPIClient(), []);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      setLoading(true);
      const response = await apiClient.auth.getUser(token);
      if (response) {
        setUser(response);
        setError(null);
      }
    } catch (err) {
      console.error('Token verification failed:', err);
      localStorage.removeItem('authToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (fullName, email, password, confirmPassword) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.auth.signup(fullName, email, password, confirmPassword);

      if (response.token) {
        localStorage.setItem('authToken', response.token);
        setUser(response.user);
        return { success: true, data: response };
      }
    } catch (err) {
      const message = err.message || 'Signup failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.auth.login(email, password);

      if (response.token) {
        localStorage.setItem('authToken', response.token);
        setUser(response.user);
        return { success: true, data: response };
      }
    } catch (err) {
      const message = err.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setError(null);
  };

  const updateProfile = async (fullName, avatar, preferences) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.auth.updateProfile(fullName, avatar, preferences);
      setUser(response.user);
      return { success: true, data: response };
    } catch (err) {
      const message = err.message || 'Profile update failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (oldPassword, newPassword, confirmPassword) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.auth.updatePassword(oldPassword, newPassword, confirmPassword);

      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }

      return { success: true, message: response.message };
    } catch (err) {
      const message = err.message || 'Password update failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signup,
        login,
        logout,
        updateProfile,
        updatePassword,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
