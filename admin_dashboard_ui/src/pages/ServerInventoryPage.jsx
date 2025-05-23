import React, { useState, useEffect } from 'react';
import { getServers, addServer } from '../services/api';

// Basic styling - can be moved to CSS files
const styles = {
    container: { padding: '20px', fontFamily: 'Arial, sans-serif' },
    title: { fontSize: '24px', marginBottom: '20px' },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '20px',
    },
    th: {
        border: '1px solid #ddd',
        padding: '8px',
        textAlign: 'left',
        backgroundColor: '#f2f2f2',
    },
    td: {
        border: '1px solid #ddd',
        padding: '8px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '20px',
        maxWidth: '400px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
    },
    input: { padding: '8px', border: '1px solid #ddd', borderRadius: '3px' },
    button: { padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' },
    error: { color: 'red', marginTop: '5px' },
    toggleButton: {
        padding: '10px 15px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginBottom: '20px',
    }
};

const ServerInventoryPage = () => {
    const [servers, setServers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    const [newServer, setNewServer] = useState({
        unique_id: '', // Assuming backend expects this, and it's user-provided or generated
        hostname: '',
        ip_address: '',
        specs: '{}', // Default to empty JSON object string
        status: 'unknown', // Default status
    });
    const [addServerError, setAddServerError] = useState('');

    const fetchServers = async () => {
        setIsLoading(true);
        setError('');
        try {
            const data = await getServers();
            setServers(data);
        } catch (err) {
            setError('Failed to fetch servers. Please ensure the backend is running and accessible.');
            console.error(err);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchServers();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewServer({ ...newServer, [name]: value });
    };

    const handleAddServer = async (e) => {
        e.preventDefault();
        setAddServerError('');
        if (!newServer.unique_id || !newServer.hostname || !newServer.ip_address) {
            setAddServerError('Unique ID, Hostname, and IP Address are required.');
            return;
        }
        try {
            // Validate JSON for specs before sending
            JSON.parse(newServer.specs);
        } catch (jsonError) {
            setAddServerError('Specs must be a valid JSON string. E.g., {"cpu": "Intel i7", "ram": "16GB"}');
            return;
        }

        try {
            await addServer(newServer);
            setShowAddForm(false); // Hide form on success
            setNewServer({ unique_id: '', hostname: '', ip_address: '', specs: '{}', status: 'unknown' }); // Reset form
            fetchServers(); // Refresh server list
        } catch (err) {
            setAddServerError('Failed to add server. ' + (err.response?.data?.detail || err.message || 'Please try again.'));
            console.error("Add server error:", err.response?.data || err);
        }
    };

    if (isLoading) return <p>Loading servers...</p>;
    if (error) return <p style={{ ...styles.error, color: 'var(--text-color)' }}>{error}</p>;

    return (
        <div style={styles.container}>
            <h2 style={{ ...styles.title, color: 'var(--text-color)' }}>Server Inventory</h2>

            <button 
                onClick={() => setShowAddForm(!showAddForm)} 
                style={{ ...styles.toggleButton, backgroundColor: 'var(--primary-color)' }}
            >
                {showAddForm ? 'Cancel' : 'Add New Server'}
            </button>

            {showAddForm && (
                // Applying morphic glass to the form container
                <form onSubmit={handleAddServer} style={{...styles.form}} className="morphic-glass-element"> 
                    <h3 style={{color: 'var(--text-color)'}}>Add New Server</h3>
                    <input
                        type="text"
                        name="unique_id"
                        placeholder="Unique ID (e.g., server001)"
                        value={newServer.unique_id}
                        onChange={handleInputChange}
                        style={styles.input} // Global styles from App.css for inputs
                        required
                    />
                    <input
                        type="text"
                        name="hostname"
                        placeholder="Hostname (e.g., web-prod-01)"
                        value={newServer.hostname}
                        onChange={handleInputChange}
                        style={styles.input}
                        required
                    />
                    <input
                        type="text"
                        name="ip_address"
                        placeholder="IP Address (e.g., 192.168.1.10)"
                        value={newServer.ip_address}
                        onChange={handleInputChange}
                        style={styles.input}
                        required
                    />
                    <textarea
                        name="specs"
                        placeholder='Specs (JSON format, e.g., {"cpu":"i7","ram":"16GB"})'
                        value={newServer.specs}
                        onChange={handleInputChange}
                        style={{ ...styles.input, height: '80px' }} // Global styles + height
                        required
                    />
                     <input
                        type="text"
                        name="status"
                        placeholder="Status (e.g., online, offline)"
                        value={newServer.status}
                        onChange={handleInputChange}
                        style={styles.input}
                    />
                    {addServerError && <p style={{ ...styles.error, color: 'var(--text-color)' }}>{addServerError}</p>}
                    <button type="submit" style={styles.button}>Add Server</button> {/* Global button style */}
                </form>
            )}

            {/* Applying morphic glass to the table */}
            <table style={styles.table} className="morphic-glass-element">
                <thead>
                    <tr>
                        <th style={styles.th}>Unique ID</th>
                        <th style={styles.th}>Hostname</th>
                        <th style={styles.th}>IP Address</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Specs</th>
                        <th style={styles.th}>Last CPU</th>
                        <th style={styles.th}>Last RAM</th>
                        <th style={styles.th}>Disk Usage</th>
                        <th style={styles.th}>Last Heartbeat</th>
                    </tr>
                </thead>
                <tbody>
                    {servers.length > 0 ? servers.map((server) => (
                        <tr key={server.unique_id}>
                            <td style={styles.td}>{server.unique_id}</td>
                            <td style={styles.td}>{server.hostname}</td>
                            <td style={styles.td}>{server.ip_address}</td>
                            <td style={styles.td}>{server.status}</td>
                            <td style={styles.td}>{typeof server.specs === 'object' ? JSON.stringify(server.specs) : server.specs}</td>
                            <td style={styles.td}>{server.last_cpu_usage || 'N/A'}</td>
                            <td style={styles.td}>{server.last_ram_usage || 'N/A'}</td>
                            <td style={styles.td}>{server.last_disk_usage_summary || 'N/A'}</td>
                            <td style={styles.td}>{server.last_heartbeat_timestamp ? new Date(server.last_heartbeat_timestamp).toLocaleString() : 'N/A'}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="9" style={{...styles.td, textAlign: 'center'}}>No servers found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ServerInventoryPage;
