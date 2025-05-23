import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import MyServersPage from './pages/MyServersPage';
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
                        {/* Default to my-servers for logged-in clients */}
                        <Route index element={<Navigate to="/my-servers" replace />} /> 
                        <Route path="my-servers" element={<MyServersPage />} />
                    </Route>
                    {/* Redirect any other paths to the main page or login */}
                    <Route path="*" element={<Navigate to="/" replace />} /> 
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
