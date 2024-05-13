import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import logo from '../img/logo_horizontal.png';
import icon_user from '../img/user.png';

function Header() {
  return (
    <header className="app-header">
      <img src={logo} className="logo" alt="Logo Checkfy" />
      <div className="container">
        <div className='links-header'>
          <Link to="/"><a href="../pages/Home.js" className="link-header">Home</a></Link>
          <Link to="/"><a href="../pages/Sobre.js" className="link-header">Sobre</a></Link>
          <Link to="/"><a href="../pages/Documentos.js" className="link-header">Documentos</a></Link>
        </div>
        <a href="../pages/Perfil.js">
          <img  src={icon_user} className="icon-user" alt="Usuário" />
        </a>
      </div>
    </header>
  );
}

export default Header;