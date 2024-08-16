import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import CreateEvaluation from './pages/CreateEvaluation';
import Evaluation from './pages/Evaluation';
import UpdateEvaluation from './pages/UpdateEvaluation';
import Results from './pages/Results';
import LoginCadastro from './pages/LoginCadastro';
import Gerenciamento from './pages/Gerenciamento';
import GerenciamentoVersaoModelo from './pages/GerenciamentoVersaoModelo';
import Niveis from './pages/Niveis';
import Processos from './pages/Processos';
import ResultadosEsperados from './pages/ResultadosEsperados';

function App() {
  const location = useLocation();
  const isLoginCadastro = location.pathname === '/login-cadastro';

  return (
    <div id="app-container">
      {!isLoginCadastro && <Header />}
      <div id="content-wrap">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-evaluation" element={<CreateEvaluation />} />
          <Route path="/evaluation" element={<Evaluation />} />
          <Route path="/update-evaluation" element={<UpdateEvaluation />} />
          <Route path="/results" element={<Results />} />
          <Route path="/login-cadastro" element={<LoginCadastro />} />
          <Route path="/gerenciamento" element={<Gerenciamento />} />
          <Route path="/gerenciamento-versao-modelo" element={<GerenciamentoVersaoModelo />} />
          <Route path="/niveis" element={<Niveis />} />
          <Route path="/processos" element={<Processos />} />
          <Route path="/resultados-esperados" element={<ResultadosEsperados />} />
        </Routes>
      </div>
      {!isLoginCadastro && <Footer />}
    </div>
  );
}

export default App;