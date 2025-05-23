import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Using CSS variables defined in App.css for theming
// No specific .morphic-glass-element class needed on layout itself if children adopt it.
// Or, apply to header and content area specifically.

// Styles for MainLayout.jsx using CSS variables
// These can be moved to a separate CSS module or kept inline for simplicity for now
const headerStyles = {
    // backgroundColor: 'var(--primary-color)', // Replaced by morphic glass
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
    borderRadius: 'var(--default-border-radius)', // Or a more specific radius for header
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    margin: '10px', // Add margin to see it "float"
};

const navStyles = {
    display: 'flex',
};

const navLinkStyles = {
    color: 'var(--text-color)', // Ensure text is readable on glass
    margin: '0 15px', // Increased margin
    textDecoration: 'none',
    fontSize: '1.1em', // Slightly larger font
};

const logoutButtonStyles = {
    background: 'none',
    border: '1px solid var(--secondary-accent-color)', // Use accent color for border
    color: 'var(--text-color)', // Ensure text is readable
    cursor: 'pointer',
    fontSize: '1em',
    padding: '8px 12px', // Added padding
    borderRadius: 'var(--default-border-radius)', // Consistent border radius
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
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
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
            <header style={headerStyles} className="morphic-glass-element"> {/* Added className for potential overrides */}
                <h1>DCIM Dashboard</h1>
                {isAuthenticated && (
                    <nav style={navStyles}>
                        <Link to="/" style={navLinkStyles}>Dashboard</Link>
                        <Link to="/servers" style={navLinkStyles}>Server Inventory</Link>
                        <Link to="/clients" style={navLinkStyles}>Client Management</Link>
                        <Link to="/ai-chat" style={navLinkStyles}>AI Chat</Link> 
                        <button onClick={handleLogout} style={logoutButtonStyles}>Logout</button>
                    </nav>
                )}
            </header>
            <main style={contentStyles} className="morphic-glass-element"> {/* Added className */}
                <Outlet /> {/* This is where nested routes will render their components */}
            </main>
        </div>
    );
};

export default MainLayout;
