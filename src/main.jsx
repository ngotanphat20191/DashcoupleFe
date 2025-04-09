import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Performance measurement
// Commented out until web-vitals is installed
// if (process.env.NODE_ENV === 'development') {
//   const reportWebVitals = async () => {
//     try {
//       const { getCLS, getFID, getLCP, getFCP, getTTFB } = await import('web-vitals');
//       getCLS(console.log);
//       getFID(console.log);
//       getLCP(console.log);
//       getFCP(console.log);
//       getTTFB(console.log);
//     } catch (error) {
//       console.warn('Web Vitals not available:', error);
//     }
//   };
//   reportWebVitals();
// }

// Remove the initial loader once React is ready
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
