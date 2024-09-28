import React, { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const register = async (userData) => {
        const response = await axios.post('http://localhost:5000/api/auth/register', userData);
        setUser(response.data.user);
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token); // Store token in localStorage
    };

    const login = async (userData) => {
        const response = await axios.post('http://localhost:5000/api/auth/login', userData);
        setUser(response.data.user);
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token); // Store token in localStorage
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token'); // Remove token from localStorage
    };

    return (
        <AuthContext.Provider value={{ user, token, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
