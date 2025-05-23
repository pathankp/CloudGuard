import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Vite's default global styles
// No need to wrap AuthProvider here if it's already in App.jsx

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
