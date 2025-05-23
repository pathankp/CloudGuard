import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Using CSS variables defined in App.css for theming

const headerStyles = {
    // backgroundColor is handled by .morphic-glass-element or direct style
    color: 'var(--text-color)', // Text color should contrast with glass
    padding: '15px 30px', // Increased padding
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    // Applying morphic glass effect directly via styles
    backgroundColor: 'var(--glass-bg-color)',
    backdropFilter: 'var(--glass-backdrop-filter)',
    WebkitBackdropFilter: 'var(--glass-backdrop-filter)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--default-border-radius)',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
    margin: '10px', // Add margin to see it "float"
};

const navStyles = {
    display: 'flex',
    alignItems: 'center', // Align items for better look with button
};

const navLinkStyles = {
    color: 'var(--text-color)', // Ensure text is readable on glass
    margin: '0 15px', // Increased margin
    textDecoration: 'none',
    fontSize: '1.1em', // Slightly larger font
};

const logoutButtonStyles = {
    background: 'var(--primary-color)', // Use primary color for button background
    border: 'none', // Remove border, rely on background
    color: 'white', // Text color for button
    cursor: 'pointer',
    fontSize: '1em',
    padding: '8px 15px', // Adjusted padding
    borderRadius: 'var(--default-border-radius)', // Consistent border radius
    marginLeft: '15px', // Space from nav links
};

const contentStyles = {
    flexGrow: 1,
    padding: '20px', // Original padding
    margin: '0 10px 10px 10px', // Margin to complement header
    // Applying morphic glass effect directly via styles for the main content background
    backgroundColor: 'var(--glass-bg-color)',
    backdropFilter: 'var(--glass-backdrop-filter)',
    WebkitBackdropFilter: 'var(--glass-backdrop-filter)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--default-border-radius)',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
    overflowY: 'auto', // Ensure content scrolls if it overflows
};


const MainLayout = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Applying .morphic-glass-element class to header */}
            <header style={headerStyles} className="morphic-glass-element">
                <h1>Client Dashboard</h1>
                {isAuthenticated && (
                    <nav style={navStyles}>
                        <Link to="/my-servers" style={navLinkStyles}>My Servers</Link>
                        {/* Add other client-specific links here if needed */}
                        <button onClick={handleLogout} style={logoutButtonStyles}>Logout</button>
                    </nav>
                )}
            </header>
            {/* Applying .morphic-glass-element class to main content area */}
            <main style={contentStyles} className="morphic-glass-element">
                <Outlet /> {/* This is where nested routes will render their components */}
            </main>
        </div>
    );
};

export default MainLayout;
