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

function remove(url) {
  return fetch(`${baseUrl}${url}`, {
    method: 'DELETE'
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro na requisição DELETE');
    }
    return response.json();
  })
  .catch(error => {
    console.error('Erro ao realizar DELETE:', error);
    throw error;
  });
}

// Funções para avaliação
function startNewEvaluation(data) {
  const url = '/add_avaliacao';
  return post(url, data)
    .then(response => {
      return response;
    });
}

function getAllAvaliacoes() {
  return get('/listar_avaliacoes');
}

function deleteAvaliacao(id) {
  return remove(`/deletar_avaliacao/${id}`);
}

function getAvaliacaoById(id) {
  return get(`/avaliacao/${id}`);
}

function updateAvaliacao(id, data) {
  return put(`/atualizar_avaliacao/${id}`, data);
}

function updateIdAtividade(id, idAtividade) {
  return put(`/atualizar_atividade/${id}`, { id_atividade: idAtividade });
}

// Funções para Níveis
function createNivel(data) {
  return post('/add_nivel', data);
}

function getNiveis(idVersaoModelo) {
  return get(`/get_niveis/${idVersaoModelo}`);
}

function updateNivel(id, data) {
  return put(`/update_nivel/${id}`, data);
}

function deleteNivel(id) {
  return deleteRequest(`/delete_nivel/${id}`);
}

// Funções para Processos
function getProcessos(idVersaoModelo) {
  return get(`/get_processos/${idVersaoModelo}`);
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
function getResultadosEsperados(processosId) {
  const query = processosId.join(',');
  return fetch(`${baseUrl}/get_resultados_esperados?processosId=${query}`)
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

function createResultadoEsperado(data) {
  return post('/add_resultado_esperado', data);
}

function updateResultadoEsperado(id, data) {
  return put(`/update_resultado_esperado/${id}`, data);
}

function deleteResultadoEsperado(id) {
  return deleteRequest(`/delete_resultado_esperado/${id}`);
}

// Funções para Projetos e Documentos
function getProjetosByAvaliacao(avaliacaoId) {
  return get(`/get_projetos_by_avaliacao/${avaliacaoId}`)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.error('Erro ao buscar projetos:', error);
      throw error;
    });
}

function createProjeto(data) {
  return post('/add_projeto', data);
}

function updateProjeto(id, data) {
  return put(`/update_projeto/${id}`, data);
}

function addDocumento(data) {
  return post('/add_documento', data)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.error('Erro ao adicionar documento:', error);
      throw error;
    });
}

function getDocumentosPorProjeto(idProjeto) {
  return get(`/documentos_por_projeto/${idProjeto}`);
}

function updateDocumento(id, data) {
  return put(`/update_documento/${id}`, data);
}

function deleteDocumento(id) {
  return deleteRequest(`/delete_documento/${id}`);
}

// Funções para Evidenciaes
function addEvidencia(data) {
  return post('/add_evidencia', data);
}

function getEvidenciasPorResultado(resultadoId, projetoId) {
  return get(`/get_evidencias_por_resultado/${resultadoId}/${projetoId}`)
    .then(response => {
      return response;
    });
}

function updateEvidencia(id, data) {
  return put(`/update_evidencia/${id}`, data);
}

function deleteEvidencia(data) {
  const { id_resultado_esperado, id_documento } = data;
  return deleteRequest(`/delete_evidencia/${id_resultado_esperado}/${id_documento}`);
}

function getProcessosPorAvaliacao(avaliacaoId, idVersaoModelo) {
  return get(`/get_processos_por_avaliacao/${avaliacaoId}/${idVersaoModelo}`).then(response => {
    return response;
  });
}

function getResultadosEsperadosPorProcesso(processoId, avaliacaoId) {
  return get(`/get_resultados_esperados_por_processo/${processoId}/${avaliacaoId}`).then(response => {
    return response;
  });
}

// Função para grau de implementação do processo do projeto
function addOrUpdateGrauImplementacao(data) {
  return post('/add_or_update_grau_implementacao', data)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.error('Erro ao adicionar/atualizar grau de implementação:', error);
      throw error;
    });
}

function getGrausImplementacao(avaliacaoId) {
  return get(`/get_graus_implementacao/${avaliacaoId}`)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.error('Erro ao buscar graus de implementação:', error);
      throw error;
    });
}

function getVersaoModelo(){
  return get(`/get_versao_modelo`)
}

function addVersaoModelo(data){
  return post('/add_versao_modelo', data)
  .then(response => {
    return response;
  })
  .catch(error => {
    console.error('Erro ao adicionar versão do modelo:', error);
    throw error;
  });
}

function deleteVersaoModelo(idVersaoModelo){
  return idVersaoModelo(`/delete_versao_modelo/${idVersaoModelo}`);
}

function updateVersaoModelo(idVersaoModelo, data){
  return put(`/update_versao_modelo/${idVersaoModelo}`, data);
}

function getEmpresas(){
  return get(`/get_empresas`)
}

function addEmpresa(data){
  return post('/add_empresa', data)
  .then(response => {
    return response;
  })
  .catch(error => {
    console.error('Erro ao adicionar versão do modelo:', error);
    throw error;
  });
}

function deleteEmpresa(idEmpresa){
  return deleteRequest(`/delete_empresa/${idEmpresa}`);
}

function updateEmpresa(idEmpresa, data){
  return put(`/update_empresa/${idEmpresa}`, data);
}

function empresaAvaliacaoInsert(avaliacaoId, data){
  return put(`/empresa_avaliacao_insert/${avaliacaoId}`, data);
}

function getInstituicoes(){
  return get(`/get_instituicoes`)
}

function addInstituicao(data){
  return post('/add_instituicao', data)
  .then(response => {
    return response;
  })
  .catch(error => {
    console.error('Erro ao adicionar versão do modelo:', error);
    throw error;
  });
}

function deleteInstituicao(idInstituicao){
  return deleteRequest(`/delete_instituicao/${idInstituicao}`);
}

function updateInstituicao(idInstituicao, data){
  return put(`/update_instituicao/${idInstituicao}`, data);
}

function instituicaoAvaliacaoInsert(avaliacaoId, data){
  return put(`/instituicao_avaliacao_insert/${avaliacaoId}`, data);
}

function inserir_planejamento(avaliacaoId, data){
  return put(`/inserir_planejamento/${avaliacaoId}`, data);
}

export {
  startNewEvaluation,
  getAllAvaliacoes,
  deleteAvaliacao,
  getAvaliacaoById,
  updateAvaliacao,
  updateIdAtividade,
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
  deleteResultadoEsperado,
  getProjetosByAvaliacao,
  createProjeto,
  updateProjeto,
  addDocumento,
  getDocumentosPorProjeto,
  updateDocumento,
  deleteDocumento,
  addEvidencia,
  getEvidenciasPorResultado,
  updateEvidencia,
  deleteEvidencia,
  getProcessosPorAvaliacao,
  getResultadosEsperadosPorProcesso,
  addOrUpdateGrauImplementacao,
  getGrausImplementacao,
  getVersaoModelo,
  addVersaoModelo,
  deleteVersaoModelo,
  updateVersaoModelo,
  getEmpresas,
  addEmpresa,
  deleteEmpresa,
  updateEmpresa,
  empresaAvaliacaoInsert,
  getInstituicoes,
  addInstituicao,
  deleteInstituicao,
  updateInstituicao,
  instituicaoAvaliacaoInsert,
  inserir_planejamento
};