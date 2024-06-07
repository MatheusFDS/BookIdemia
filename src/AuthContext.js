// src/AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import { authenticateUser, registerUser } from './api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const login = async (email, password) => {
    const user = await authenticateUser(email, password);
    if (user) {
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    }
    return user;
  };

  const register = async (name, email, password) => {
    const newUser = await registerUser(name, email, password);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
