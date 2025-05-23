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
        // Assuming the same token auth endpoint as admin for now
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
};

// Fetch servers assigned to the logged-in client
export const getMyServers = async () => {
    try {
        // This endpoint needs to be implemented in the backend
        // It should return servers based on the authenticated client user
        const response = await apiClient.get('/my-servers/');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch client servers:', error.response || error.message);
        // Mock data for frontend development if endpoint is not ready
        if (error.response && error.response.status === 404) {
            console.warn("'/my-servers/' endpoint not found. Using mock data for now.");
            return [
                { unique_id: 'mock-server-001', hostname: 'client-vm-alpha', ip_address: '10.0.0.10', status: 'online', specs: { cpu: '2 Cores', ram: '4GB' } },
                { unique_id: 'mock-server-002', hostname: 'client-db-bravo', ip_address: '10.0.0.11', status: 'offline', specs: { cpu: '4 Cores', ram: '8GB' } },
            ];
        }
        throw error;
    }
};

export default apiClient;
