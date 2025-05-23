import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Vite's default global styles
// AuthProvider is already in App.jsx, so no need to wrap here

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
