import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { CookieProvider } from './contexts/CookieContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CookieProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </CookieProvider>
  </React.StrictMode>
);