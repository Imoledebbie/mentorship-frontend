import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRoutes from './AppRoutes';  // import your routing component
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <AppRoutes />  {/* use your routes here */}
  </React.StrictMode>
);

reportWebVitals();
