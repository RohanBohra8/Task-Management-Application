import React, { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const register = async (userData) => {
        try {
            const response = await axios.post('http://localhost:5000/api/users/register/', userData);
            setUser(response.data.user);
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token); // Store token in localStorage
        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    const login = async (userData) => {
        try {
            const response = await axios.post('http://localhost:5000/api/users/login/', userData);
            setUser(response.data.user);
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token); // Store token in localStorage
        } catch (error) {
            console.error('Error during login:', error);
        }
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
