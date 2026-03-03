import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const container = document.getElementById('root');
console.log('Mounting React on root:', container);
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);