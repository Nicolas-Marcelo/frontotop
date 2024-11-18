import React, { useState } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import Rotas from './Routes/Rotas';
import Header from './DataManipulation/Header';
import './App.css';
import { toast, ToastContainer } from 'react-toastify';

function App() {
  const [menuAberto, setMenuAberto] = useState(false);

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  return (
    <BrowserRouter>
      <Header onMenuClick={toggleMenu} />
      <button className={`toggle-btn ${menuAberto ? 'open' : ''}`} onClick={toggleMenu}>
        ☰
      </button>
      <div className={`sidebar ${menuAberto ? 'open' : ''}`}>
        <nav>
          <Link to='/home' onClick={toggleMenu}>Home</Link>
          <Link to='/googleauth' onClick={toggleMenu}>Minha Conta</Link>
          <Link to='/adicionar' onClick={toggleMenu}>Adicionar Desafio</Link>
          <Link to='/exibirdesafio' onClick={toggleMenu}>Meus Desafios</Link>
        </nav>
      </div>
      <div className={`content ${menuAberto ? 'content-open' : ''}`}>
        <Rotas />
      </div>
    </BrowserRouter>
  );
}

export default App;
