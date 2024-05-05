import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CreateEvaluation from './pages/CreateEvaluation';
import Evaluation from './pages/Evaluation';
import Results from './pages/Results';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-evaluation" element={<CreateEvaluation />} />
        <Route path="/evaluation" element={<Evaluation />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;