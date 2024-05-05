const baseUrl = 'http://localhost:3000/api';

function post(url, data) {
  console.log(`POST Request to: ${baseUrl}${url} with data:`, data);
}

function generateRandomArray() {
  const titles = ["Gerenciador", "Coordenador", "Teste", "Revisão", "Análise"];
  const length = Math.floor(Math.random() * 5) + 3; // Gera entre 3 e 7 elementos
  return Array.from({ length }, () => {
    return {
      titulo: titles[Math.floor(Math.random() * titles.length)],
      identificador: Math.floor(Math.random() * 5) + 1
    };
  });
}

function startNewEvaluation(data) {
  const url = `${baseUrl}/start-evaluation`;
  console.log('Enviando dados para iniciar nova avaliação:', data);
  post(url, data);
  return new Promise((resolve) => {
    setTimeout(() => {
      const response = generateRandomArray();
      console.log('Resposta do início da avaliação:', response);
      resolve(response);
    }, 1000);
  });
}

function submitEvaluationData(data) {
  const url = `${baseUrl}/submit-data`;
  console.log('Dados enviados para avaliação:', data);
  post(url, data);
  return new Promise((resolve) => {
    setTimeout(() => {
      if (Math.random() > 0.7) { // 30% de chance de finalizar
        console.log('Avaliação finalizada');
        resolve({ finalizada: true });
      } else {
        const newSetup = generateRandomArray();
        console.log('Nova configuração recebida do back-end:', newSetup);
        resolve({ setup: newSetup });
      }
    }, 1000);
  });
}

function get(url) {
  return fetch(`${baseUrl}${url}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error:', error);
    });
}


function getProcessos() {
  return get('/processos');
}

function createProcesso(data) {
  console.log(`POST Request to: ${baseUrl}/processos with data:`, data);
  // Implementação do POST
}

function updateProcesso(id, data) {
  console.log(`PUT Request to: ${baseUrl}/processos/${id} with data:`, data);
  // Implementação do PUT
}

function deleteProcesso(id) {
  console.log(`DELETE Request to: ${baseUrl}/processos/${id}`);
  // Implementação do DELETE
}

export {
  getProcessos,
  createProcesso,
  updateProcesso,
  deleteProcesso,
  startNewEvaluation,
  submitEvaluationData
};