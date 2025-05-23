import React, { useState, useEffect } from 'react';
import { getClients, addClient } from '../services/api';

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

const ClientManagementPage = () => {
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    const [newClient, setNewClient] = useState({
        name: '',
        contact_info: '',
    });
    const [addClientError, setAddClientError] = useState('');

    const fetchClients = async () => {
        setIsLoading(true);
        setError('');
        try {
            const data = await getClients();
            setClients(data);
        } catch (err) {
            setError('Failed to fetch clients. Please ensure the backend is running and accessible.');
            console.error(err);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewClient({ ...newClient, [name]: value });
    };

    const handleAddClient = async (e) => {
        e.preventDefault();
        setAddClientError('');
        if (!newClient.name) {
            setAddClientError('Client name is required.');
            return;
        }
        try {
            await addClient(newClient);
            setShowAddForm(false); // Hide form on success
            setNewClient({ name: '', contact_info: '' }); // Reset form
            fetchClients(); // Refresh client list
        } catch (err) {
            setAddClientError('Failed to add client. ' + (err.response?.data?.detail || err.message || 'Please try again.'));
            console.error("Add client error:", err.response?.data || err);
        }
    };

    if (isLoading) return <p>Loading clients...</p>;
    if (error) return <p style={{ ...styles.error, color: 'var(--text-color)' }}>{error}</p>;

    return (
        <div style={styles.container}>
            <h2 style={{ ...styles.title, color: 'var(--text-color)' }}>Client Management</h2>

            <button 
                onClick={() => setShowAddForm(!showAddForm)} 
                style={{ ...styles.toggleButton, backgroundColor: 'var(--primary-color)' }}
            >
                {showAddForm ? 'Cancel' : 'Add New Client'}
            </button>

            {showAddForm && (
                // Applying morphic glass to the form container
                <form onSubmit={handleAddClient} style={styles.form} className="morphic-glass-element">
                    <h3 style={{color: 'var(--text-color)'}}>Add New Client</h3>
                    <input
                        type="text"
                        name="name"
                        placeholder="Client Name (e.g., Company Corp)"
                        value={newClient.name}
                        onChange={handleInputChange}
                        style={styles.input} // Global styles from App.css
                        required
                    />
                    <textarea
                        name="contact_info"
                        placeholder="Contact Info (e.g., email@example.com, +123456789)"
                        value={newClient.contact_info}
                        onChange={handleInputChange}
                        style={{ ...styles.input, height: '80px' }} // Global styles + height
                    />
                    {addClientError && <p style={{ ...styles.error, color: 'var(--text-color)' }}>{addClientError}</p>}
                    <button type="submit" style={styles.button}>Add Client</button> {/* Global button style */}
                </form>
            )}

            {/* Applying morphic glass to the table */}
            <table style={styles.table} className="morphic-glass-element">
                <thead>
                    <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>Contact Info</th>
                        <th style={styles.th}>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.length > 0 ? clients.map((client) => (
                        <tr key={client.id}>
                            <td style={styles.td}>{client.id.substring(0,8)}...</td> {/* Show shortened ID */}
                            <td style={styles.td}>{client.name}</td>
                            <td style={styles.td}>{client.contact_info}</td>
                            <td style={styles.td}>{new Date(client.created_at).toLocaleDateString()}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="4" style={{...styles.td, textAlign: 'center'}}>No clients found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ClientManagementPage;
