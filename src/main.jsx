import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const removeLoader = () => {
  const loader = document.querySelector('.initial-loader');
  if (loader) {
    loader.remove();
  }
};

// Create root and render app
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Remove loader after render
removeLoader();
