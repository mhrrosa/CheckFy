import React, { useState, useEffect } from 'react';
import { mockApiCall } from '../services/Api'; // Importando do arquivo de serviços
import Stage from './Stage';

const StageManager = () => {
  const [currentElements, setCurrentElements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNextStage = async () => {
    setLoading(true);
    const newElements = await mockApiCall();
    setCurrentElements(newElements);
    setLoading(false);
  };

  useEffect(() => {
    fetchNextStage();
  }, []);

  const handleComplete = () => {
    fetchNextStage();
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <Stage elements={currentElements} onComplete={handleComplete} />
    </div>
  );
};

export default StageManager;