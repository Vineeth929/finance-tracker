console.log('🚀 [BOOTSTRAP] main.jsx - App is loading');

// CRITICAL: Catch any errors before they crash the app silently
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    console.error('❌ [FATAL] Uncaught error in main thread:', event.error?.message || event.message);
    console.error('   Stack:', event.error?.stack);
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ [FATAL] Unhandled promise rejection:', event.reason?.message || event.reason);
    console.error('   Reason:', event.reason);
  });
}

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

console.log('✅ [BOOTSTRAP] React imports loaded, rendering app...');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

console.log('✅ [BOOTSTRAP] App.render() called');
