import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'; // Importe o BrowserRouter
import App from './App';
import { UserProvider } from './contexts/UserContext'; // Importe o UserProvider
import { ToastProvider } from './contexts/ToastContext';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter> {/* Envolva o App com o BrowserRouter */}
      <UserProvider> {/* Envolva o App com o UserProvider */}
        <ToastProvider>
          <App />
        </ToastProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);