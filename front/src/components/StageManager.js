import React, { useState, useEffect } from 'react';
import Stage from './Stage';

const StageManager = () => {
  // Estado para os elementos da etapa atual
  const [currentElements, setCurrentElements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulando a chamada ao back-end para buscar a próxima etapa
  const fetchNextStage = async () => {
    setLoading(true);
    // Aqui você substituiria o fetch abaixo pela sua chamada de API real
    const response = await fetch('URL_DA_SUA_API');
    const data = await response.json();
    setCurrentElements(data);
    setLoading(false);
  };

  // Use useEffect para carregar a primeira etapa quando o componente for montado
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
