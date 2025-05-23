import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ServerInventoryPage from './pages/ServerInventoryPage';
import ClientManagementPage from './pages/ClientManagementPage';
import AIChatPage from './pages/AIChatPage'; // Import AIChatPage
import './App.css'; // Basic global styles

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route 
                        path="/" 
                        element={
                            <ProtectedRoute>
                                <MainLayout />
                            </ProtectedRoute>
                        }
                    >
                        {/* Nested routes will render inside MainLayout's <Outlet /> */}
                        <Route index element={<Navigate to="/dashboard" replace />} /> {/* Default to dashboard */}
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="servers" element={<ServerInventoryPage />} />
                        <Route path="clients" element={<ClientManagementPage />} />
                        <Route path="ai-chat" element={<AIChatPage />} /> {/* Add AI Chat route */}
                    </Route>
                    {/* You could add a 404 page here if needed */}
                    <Route path="*" element={<Navigate to="/" replace />} /> 
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
