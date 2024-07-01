import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import CreateEvaluation from './pages/CreateEvaluation';
import Evaluation from './pages/Evaluation';
import UpdateEvaluation from './pages/UpdateEvaluation';  // Adicione esta linha
import Results from './pages/Results';
import Modelo from './pages/Modelo';
import Niveis from './pages/Niveis';
import Processos from './pages/Processos';
import ResultadosEsperados from './pages/ResultadosEsperados';

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