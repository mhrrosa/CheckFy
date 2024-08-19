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
import Niveis from './pages/Niveis';
import Processos from './pages/Processos';
import ResultadosEsperados from './pages/ResultadosEsperados';
import ProtectedRoute from './components/ProtectedRoute'; // Importe o ProtectedRoute

function App() {
  const location = useLocation();
  const isLoginCadastro = location.pathname === '/login-cadastro';

  console.log('Rota atual:', location.pathname);
  console.log('É a página de login/cadastro?', isLoginCadastro);

  return (
    <div id="app-container">
      {!isLoginCadastro && <Header />}
      <div id="content-wrap">
        <Routes>
          <Route path="/login-cadastro" element={<LoginCadastro />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-evaluation" 
            element={
              <ProtectedRoute>
                <CreateEvaluation />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/evaluation" 
            element={
              <ProtectedRoute>
                <Evaluation />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/update-evaluation" 
            element={
              <ProtectedRoute>
                <UpdateEvaluation />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/results" 
            element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/gerenciamento" 
            element={
              <ProtectedRoute>
                <Gerenciamento />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/niveis" 
            element={
              <ProtectedRoute>
                <Niveis />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/processos" 
            element={
              <ProtectedRoute>
                <Processos />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/resultados-esperados" 
            element={
              <ProtectedRoute>
                <ResultadosEsperados />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
      {!isLoginCadastro && <Footer />}
    </div>
  );
}

export default App;