import React from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import CreateEvaluation from './pages/CreateEvaluation';
import Evaluation from './pages/Evaluation';
import UpdateEvaluation from './pages/UpdateEvaluation';
import Results from './pages/Results';
import LoginCadastro from './pages/LoginCadastro';
import Gerenciamento from './pages/Gerenciamento';
import Niveis from './pages/Niveis';
import Processos from './pages/Processos';
import ResultadosEsperados from './pages/ResultadosEsperados';
import GerenciamentoVersaoModelo from './components/GerenciamentoVersaoModelo';

function App() {
  return (
    <Router>
      <div id="app-container">
        <Header />
        <div id="content-wrap">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-evaluation" element={<CreateEvaluation />} />
            <Route path="/evaluation" element={<Evaluation />} />
            <Route path="/update-evaluation" element={<UpdateEvaluation />} />
            <Route path="/results" element={<Results />} />
            <Route path="/login-cadastro" element={<LoginCadastro />} />
            <Route path="/gerenciamento" element={<Gerenciamento />} />
            <Route path="/niveis" element={<Niveis />} />
            <Route path="/processos" element={<Processos />} />
            <Route path="/resultados-esperados" element={<ResultadosEsperados />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;