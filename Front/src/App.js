import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import GerenciamentoAnos from './pages/GerenciamentoAnos';
import Login from './pages/LoginCadastro';
import Home from './pages/Home';
import CreateEvaluation from './pages/CreateEvaluation';
import Evaluation from './pages/Evaluation';
import UpdateEvaluation from './pages/UpdateEvaluation';
import Results from './pages/Results';
import Modelo from './pages/Modelo';
import Niveis from './pages/Niveis';
import Processos from './pages/Processos';
import ResultadosEsperados from './pages/ResultadosEsperados';
import './App.css';
import GerenciamentoVersaoModelo from './pages/GerenciamentoVersaoModelo';
import Header from './components/Header';
import Footer from './components/Footer';

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
            <Route path="/gerenciamento-versao-modelo" element={<GerenciamentoVersaoModelo />} />
            <Route path="/niveis" element={<Niveis />} />
            <Route path="/processos" element={<Processos />} />
            <Route path="/resultados-esperados" element={<ResultadosEsperados />} />
          </Routes>
        </div>
        <Footer />
      </div>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const isLoginRoute = location.pathname === '/login';

  return (
    <div id="app-container">
      {!isLoginRoute && <Header />}
      <div id="content-wrap">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-evaluation" element={<CreateEvaluation />} />
          <Route path="/evaluation" element={<Evaluation />} />
          <Route path="/update-evaluation" element={<UpdateEvaluation />} />
          <Route path="/results" element={<Results />} />
          <Route path="/modelo/:ano" element={<Modelo />} />
          <Route path="/gerenciamento-anos" element={<GerenciamentoAnos />} />
          <Route path="/niveis/:ano" element={<Niveis />} />
          <Route path="/processos/:ano" element={<Processos />} />
          <Route path="/resultados-esperados/:ano" element={<ResultadosEsperados />} />
        </Routes>
      </div>
      {!isLoginRoute && <Footer />}
    </div>
  );
}

export default App;