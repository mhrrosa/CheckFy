const baseUrl = 'http://127.0.0.1:5000';

function post(url, data) {
  return fetch(`${baseUrl}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Erro na requisição POST para ${url}: ${response.status}`);
    }
    return response.json();
  })
  .catch(error => {
    console.error('Erro ao realizar POST:', error);
    throw error;
  });
}

function get(url) {
  return fetch(`${baseUrl}${url}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro na requisição GET');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Erro ao realizar GET:', error);
      throw error;
    });
}

function put(url, data) {
  return fetch(`${baseUrl}${url}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(response => {
    if (!response.ok) {
      throw new Error(`Erro na requisição PUT para ${url}: ${response.status}`);
    }
    return response.json();
  }).catch(error => {
    console.error('Erro ao realizar PUT:', error);
    throw error;
  });
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

function deleteRequest(url) {
  return fetch(`${baseUrl}${url}`, {
    method: 'DELETE'
  }).then(response => {
    if (!response.ok) {
      throw new Error('Erro na requisição DELETE');
    }
    return response.json();
  }).catch(error => {
    console.error('Erro ao realizar DELETE:', error);
    throw error;
  });
}

// Funções para Níveis
function createNivel(data) {
  return post('/add_nivel', data);
}

function getNiveis() {
  return get('/get_all_niveis');
}

function updateNivel(id, data) {
  return put(`/update_nivel/${id}`, data);
}

function deleteNivel(id) {
  return deleteRequest(`/delete_nivel/${id}`);
}
// Funções para Processos
function getProcessos() {
  return get('/get_all_processos');
}

function createProcesso(data) {
  return post('/add_processo', data);
}

function updateProcesso(id, data) {
  return put(`/update_processo/${id}`, data);
}

function deleteProcesso(id) {
  return deleteRequest(`/delete_processo/${id}`);
}

// Funções para Resultados Esperados
function getResultadosEsperados() {
  return get('/resultados-esperados');
}

function createResultadoEsperado(data) {
  return post('/resultados-esperados', data);
}

function updateResultadoEsperado(id, data) {
  return put(`/resultados-esperados/${id}`, data);
}

function deleteResultadoEsperado(id) {
  return deleteRequest(`/resultados-esperados/${id}`);
}

export {
  startNewEvaluation,
  submitEvaluationData,
  getNiveis,
  createNivel,
  updateNivel,
  deleteNivel,
  getProcessos,
  createProcesso,
  updateProcesso,
  deleteProcesso,
  getResultadosEsperados,
  createResultadoEsperado,
  updateResultadoEsperado,
  deleteResultadoEsperado
};
