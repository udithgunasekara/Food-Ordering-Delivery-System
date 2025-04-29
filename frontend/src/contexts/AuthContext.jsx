import React, { createContext, useState, useEffect } from 'react';
import { mockUsers } from '../data/users';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Check for existing auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    
    setLoading(false);
  }, []);
  
  // Mock login functionality
  const login = (email, password) => {
    // Find user in mock data
    const foundUser = mockUsers.find(u => 
      u.email === email && u.password === password
    );
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      
      // Create mock JWT token (just for simulation)
      const token = `mock-jwt-token-${Math.random().toString(36).substr(2, 9)}`;
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('token', token);
      
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      
      return { success: true, user: userWithoutPassword };
    } else {
      return { success: false, message: 'Invalid email or password' };
    }
  };
  
  // Mock register functionality
  const register = (userData) => {
    // Check if email already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    
    if (existingUser) {
      return { success: false, message: 'Email already registered' };
    }
    
    // In a real app, we would save to DB
    // For our mock, we just simulate success
    
    // Create new user (with ROLE_CUSTOMER by default)
    const newUser = {
      id: `user-${Math.random().toString(36).substr(2, 9)}`,
      ...userData,
      role: 'ROLE_CUSTOMER'
    };
    
    const { password, ...userWithoutPassword } = newUser;
    
    // Create mock JWT token
    const token = `mock-jwt-token-${Math.random().toString(36).substr(2, 9)}`;
    
    // Store in localStorage
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    localStorage.setItem('token', token);
    
    setUser(userWithoutPassword);
    setIsAuthenticated(true);
    
    return { success: true, user: userWithoutPassword };
  };
  
  // Logout functionality
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    setUser(null);
    setIsAuthenticated(false);
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};