import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Using CSS variables and .morphic-glass-element from App.css

const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    // Background color is set globally on body
};

const formStyles = {
    // Inherits .morphic-glass-element styles via className
    padding: '30px', // Increased padding
    width: '100%',
    maxWidth: '400px', // Max width for the form
    display: 'flex',
    flexDirection: 'column',
};

const inputStyles = {
    margin: '10px 0',
    padding: '12px', // Increased padding
    fontSize: '16px',
    // Border and border-radius will be from App.css global input styling
    // which now uses CSS variables
};

const buttonStyles = {
    padding: '12px 15px', // Increased padding
    fontSize: '16px',
    // Background, color, border, border-radius from App.css global button styling
    cursor: 'pointer',
    marginTop: '10px', // Added margin-top
};

const errorStyles = {
    color: 'red', // Standard error color
    marginTop: '10px',
    textAlign: 'center',
};

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/"; // Default redirect to home/dashboard

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const success = await auth.login(username, password);
            if (success) {
                navigate(from, { replace: true });
            } else {
                setError('Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError('An error occurred during login. Please try again.');
            console.error("Login page error:", err);
        }
    };

    return (
        <div style={containerStyles}>
            {/* Applying .morphic-glass-element class to the form */}
            <form onSubmit={handleSubmit} style={formStyles} className="morphic-glass-element">
                <h2 style={{ textAlign: 'center', color: 'var(--text-color)', marginBottom: '20px' }}>Client Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={inputStyles} // Uses global styles from App.css for border, etc.
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={inputStyles} // Uses global styles from App.css
                    required
                />
                <button type="submit" style={buttonStyles}>Login</button> {/* Uses global styles */}
                {error && <p style={errorStyles}>{error}</p>}
            </form>
        </div>
    );
};

export default LoginPage;
