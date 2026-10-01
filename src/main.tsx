import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import './theme.css';

import App from './App';
import { AuthProvider } from './contexts/AuthProvider';

const savedTheme =
    localStorage.getItem('meuinvest-theme');

const theme =
    savedTheme === 'light' ||
    savedTheme === 'dark' ||
    savedTheme === 'system'
        ? savedTheme
        : 'system';

document.documentElement.dataset.theme = theme;

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </StrictMode>,
);