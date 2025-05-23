import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Function to get the token from localStorage
const getToken = () => localStorage.getItem('authToken');

// Add a request interceptor to include the token in headers
apiClient.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const login = async (username, password) => {
    try {
        const response = await apiClient.post('/api-token-auth/', { username, password });
        if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);
        }
        return response.data;
    } catch (error) {
        console.error('Login failed:', error.response || error.message);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('authToken');
    // Optionally, could also call a backend logout endpoint if it exists
};

// Server Management
export const getServers = async () => {
    try {
        const response = await apiClient.get('/servers/');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch servers:', error.response || error.message);
        throw error;
    }
};

export const addServer = async (serverData) => {
    // Ensure specs is a JSON object if it's passed as a string
    let dataToSend = { ...serverData };
    if (typeof serverData.specs === 'string') {
        try {
            dataToSend.specs = JSON.parse(serverData.specs);
        } catch (e) {
            console.error("Specs field is not valid JSON:", e);
            // Fallback to sending as is, or handle error appropriately
            // For now, let the backend validate if it's malformed
        }
    }

    try {
        const response = await apiClient.post('/servers/', dataToSend);
        return response.data;
    } catch (error) {
        console.error('Failed to add server:', error.response ? JSON.stringify(error.response.data) : error.message);
        throw error;
    }
};


// Client Management
export const getClients = async () => {
    try {
        const response = await apiClient.get('/clients/');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch clients:', error.response || error.message);
        throw error;
    }
};

export const addClient = async (clientData) => {
    try {
        const response = await apiClient.post('/clients/', clientData);
        return response.data;
    } catch (error) {
        console.error('Failed to add client:', error.response || error.message);
        throw error;
    }
};

export default apiClient;
