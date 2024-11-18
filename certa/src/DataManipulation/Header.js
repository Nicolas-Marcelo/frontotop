// Header.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import './Header.css';

const Header = ({ onMenuClick }) => {
  const pagina = useLocation();

  const tituloRotas = {
    '/home': 'Todos Desafios',
    '/googleauth': 'Sua Conta',
    '/adicionar': 'Adicionar Desafio',
    '/exibirdesafio': 'Meus Desafios',
  };

  const titulo = tituloRotas[pagina.pathname] || 'CorrectTask';

  return (
    <header className="header">
      <h1 className='header-title'>CorrectTask</h1>
      <h1 className="header-title">{titulo}</h1>
      <button className="menu-button" onClick={onMenuClick}>
        ☰
      </button>
    </header>
  );
};

export default Header;
