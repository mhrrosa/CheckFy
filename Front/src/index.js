import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { UserProvider } from './contexts/UserContext'; // Importe o UserProvider

ReactDOM.render(
  <React.StrictMode>
    <UserProvider> {/* Envolva o App com o UserProvider */}
      <App />
    </UserProvider>
  </React.StrictMode>,
  document.getElementById('root')
);