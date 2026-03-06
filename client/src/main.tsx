import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { HelmetProvider } from 'react-helmet-async';

const container = document.getElementById('root');
console.log('Mounting React on root:', container);
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);