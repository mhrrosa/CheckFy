import React from 'react';
import { Link } from 'react-router-dom';
import '../components/styles/Header.css';
import logo from '../img/logo_horizontal.png';
import icon_user from '../img/user.png';

function Header() {
  return (
    <header className="app-header">
      <img src={logo} className="logo" alt="Logo Checkfy" />
      <div className="container-header">
        <div className='links-header'>
          <Link to="/" className="link-header">Home</Link>
          <Link to="/sobre" className="link-header">Sobre</Link>
          <Link to="/documentos" className="link-header">Documentos</Link>
        </div>
        <Link to="/login">
          <img src={icon_user} className="icon-user" alt="Usuário" />
        </Link>
      </div>
    </header>
  );
}

export default Header;