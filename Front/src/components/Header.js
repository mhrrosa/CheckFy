import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css'; // Importe o CSS para estilização

function Header() {
  return (
    <header className="app-header">
      <Link to="/">
        <img src="/home-icon.png" className="home-icon" /> ICONE HOME AQUI
      </Link>
    </header>
  );
}

export default Header;