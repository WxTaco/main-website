import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { CookieProvider } from './contexts/CookieContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CookieProvider>
      <ThemeProvider>
        <DndProvider backend={HTML5Backend}>
          <App />
        </DndProvider>
      </ThemeProvider>
    </CookieProvider>
  </React.StrictMode>
);