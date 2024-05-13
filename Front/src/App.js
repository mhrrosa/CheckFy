import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import CreateEvaluation from './pages/CreateEvaluation';
import Evaluation from './pages/Evaluation';
import Results from './pages/Results';
import Modelo from './pages/Modelo';
import Niveis from './pages/Niveis';
import Processos from './pages/Processos';
import ResultadosEsperados from './pages/ResultadosEsperados';
import './styles/App.css';

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
            <Route path="/results" element={<Results />} />
            <Route path="/modelo" element={<Modelo />} />
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