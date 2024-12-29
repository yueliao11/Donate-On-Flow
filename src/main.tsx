import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeFlow } from './services/flow/config';
import { AuthProvider } from './context/AuthContext';
import App from './App.tsx';
import './index.css';

// Initialize Flow configuration
initializeFlow();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);