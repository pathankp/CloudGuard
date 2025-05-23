import React from 'react';

const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        fontSize: '24px',
        marginBottom: '20px',
    },
    content: {
        fontSize: '16px',
    }
};

const DashboardPage = () => {
    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Dashboard</h2>
            <p style={styles.content}>Welcome to the DCIM Admin Dashboard.</p>
            <p style={styles.content}>This is a placeholder page. More features will be added soon!</p>
        </div>
    );
};

export default DashboardPage;
