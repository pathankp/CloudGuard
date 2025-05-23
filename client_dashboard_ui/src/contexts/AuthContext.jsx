import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Could store user details if API returns them
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [isLoading, setIsLoading] = useState(true); // To handle initial token check

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            setToken(storedToken);
            // Here you might want to verify the token with the backend
            // For now, we'll assume the token is valid if it exists
            setUser({ isAuthenticated: true }); // Placeholder user object
        }
        setIsLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const data = await apiLogin(username, password);
            if (data.token) {
                setToken(data.token);
                localStorage.setItem('authToken', data.token);
                setUser({ isAuthenticated: true }); // Update user state
                return true;
            }
            return false;
        } catch (error) {
            console.error("AuthContext login error:", error);
            return false;
        }
    };

    const logout = () => {
        apiLogout(); // Clears token from localStorage
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
