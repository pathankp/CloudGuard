import React, { useState, useEffect } from 'react';
import { getMyServers } from '../services/api'; // Assuming getMyServers is implemented in api.js

// Basic styling - can be moved to CSS files
const styles = {
    container: { padding: '20px', fontFamily: 'Arial, sans-serif' },
    title: { fontSize: '24px', marginBottom: '20px', color: '#333' },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    th: {
        borderBottom: '2px solid #007bff',
        padding: '12px',
        textAlign: 'left',
        backgroundColor: '#f8f9fa', // Light background for header
        color: '#007bff',
        fontWeight: 'bold',
    },
    td: {
        borderBottom: '1px solid #ddd',
        padding: '10px',
    },
    error: { color: 'red', marginTop: '10px', fontSize: '1.1em' },
    loading: { fontSize: '1.2em', color: '#555', textAlign: 'center', padding: '30px' }
};

const MyServersPage = () => {
    const [servers, setServers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchMyServers = async () => {
        setIsLoading(true);
        setError('');
        try {
            const data = await getMyServers(); // API call
            setServers(data);
        } catch (err) {
            setError('Failed to fetch your servers. Please try again later.');
            console.error("Error fetching client's servers:", err);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchMyServers();
    }, []);

    if (isLoading) return <p style={{ ...styles.loading, color: 'var(--text-color)' }}>Loading your servers...</p>;
    if (error) return <p style={{ ...styles.error, color: 'var(--text-color)' }}>{error}</p>;

    return (
        <div style={styles.container}>
            <h2 style={{ ...styles.title, color: 'var(--text-color)' }}>My Servers</h2>
            {servers.length > 0 ? (
                // Applying morphic glass to the table
                <table style={styles.table} className="morphic-glass-element">
                    <thead>
                        <tr>
                            <th style={styles.th}>Hostname</th>
                            <th style={styles.th}>IP Address</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.th}>Specifications</th>
                        </tr>
                    </thead>
                    <tbody>
                        {servers.map((server) => (
                            <tr key={server.unique_id}>
                                <td style={styles.td}>{server.hostname}</td>
                                <td style={styles.td}>{server.ip_address}</td>
                                <td style={styles.td}>{server.status}</td>
                                <td style={styles.td}>
                                    {server.specs ? 
                                        (typeof server.specs === 'object' ? JSON.stringify(server.specs) : server.specs) 
                                        : 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>You currently have no servers assigned to you.</p>
            )}
        </div>
    );
};

export default MyServersPage;
