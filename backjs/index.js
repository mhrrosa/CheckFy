const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Database } = require('./config/db');
const Atividade = require('./classes/Atividade'); 
const Auditor = require('./classes/Auditor');
const Avaliacao = require('./classes/Avaliacao');
const Documento = require('./classes/Documento');
const Email = require('./classes/Email');
const Empresa = require('./classes/Empresa');
const Instituicao = require('./classes/Instituicao');
const Cadastro = require('./classes/Cadastro');
const Login = require('./classes/Login');
const Nivel = require('./classes/Nivel');
const Processo = require('./classes/Processo');
const Projeto = require('./classes/Projeto');
const Relatorio = require('./classes/Relatorio');
const ResultadoEsperado = require('./classes/ResultadoEsperado');
const VersaoModelo = require('./classes/VersaoModelo');

// Configuração do Express
const app = express();
app.use(cors());
app.use(express.json());

const UPLOAD_FOLDER = 'uploads';
if (!fs.existsSync(UPLOAD_FOLDER)) {
    fs.mkdirSync(UPLOAD_FOLDER);
}

// Configuração do multer para salvar os arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_FOLDER);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });


// Conexão com o banco de dados MySQL
const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'checkfy'
};

// Criando objetos
const db = new Database(dbConfig);
// Inicializando as classes que vão usar db:
const atividade = new Atividade(db);
const auditor = new Auditor(db);
const avaliacao = new Avaliacao(db);
const documento = new Documento(db);
const email = new Email(db);
const empresa = new Empresa(db);
const instituicao = new Instituicao(db);
const cadastro = new Cadastro(db);
const login = new Login(db);
const nivel = new Nivel(db);
const processo = new Processo(db);
const projeto = new Projeto(db);
const relatorio = new Relatorio(db);
const resultadoEsperado = new ResultadoEsperado(db);
const versaoModelo = new VersaoModelo(db);

app.post('/add_nivel', async (req, res) => {
    const { nivel, nome_nivel, id_versao_modelo } = req.body;
    try {
        await nivel.addNivel(nivel, nome_nivel, id_versao_modelo);
        res.status(200).json({ message: "Nível adicionado com sucesso" });
    } catch (error) {
        console.error(`Erro ao adicionar nível: ${error}`);
        res.status(500).json({ message: "Erro ao adicionar nível", error: error.message });
    }
});

// Rota para obter todos os níveis de uma versão de modelo específica
app.get('/get_niveis/:id_versao_modelo', async (req, res) => {
    const { id_versao_modelo } = req.params;
    try {
        const niveis = await nivel.getNiveis(id_versao_modelo);
        res.status(200).json(niveis);
    } catch (error) {
        console.error(`Erro ao buscar níveis: ${error}`);
        res.status(500).json({ message: "Erro ao buscar níveis", error: error.message });
    }
});

// Rota para deletar um nível específico
app.delete('/delete_nivel/:nivel_id', async (req, res) => {
    const { nivel_id } = req.params;
    try {
        await nivel.deleteNivel(nivel_id);
        res.status(200).json({ message: "Nível deletado com sucesso" });
    } catch (error) {
        console.error(`Erro ao deletar nível: ${error}`);
        res.status(500).json({ message: "Erro ao deletar nível", error: error.message });
    }
});

// Rota para atualizar um nível específico
app.put('/update_nivel/:nivel_id', async (req, res) => {
    const { nivel_id } = req.params;
    const { nivel, nome_nivel } = req.body;
    try {
        await nivel.updateNivel(nivel_id, nivel, nome_nivel);
        res.status(200).json({ message: "Nível atualizado com sucesso" });
    } catch (error) {
        console.error(`Erro ao atualizar nível: ${error}`);
        res.status(500).json({ message: "Erro ao atualizar nível", error: error.message });
    }
});

// Rota para adicionar um novo processo
app.post('/add_processo', async (req, res) => {
    const { descricao, tipo, id_versao_modelo } = req.body;
    try {
        await processo.addProcesso(descricao, tipo, id_versao_modelo);
        res.status(200).json({ message: "Processo adicionado com sucesso" });
    } catch (error) {
        console.error(`Erro ao adicionar processo: ${error}`);
        res.status(500).json({ message: "Erro ao adicionar processo", error: error.message });
    }
});

// Rota para buscar processos de uma versão de modelo específica
app.get('/get_processos/:id_versao_modelo', async (req, res) => {
    const { id_versao_modelo } = req.params;
    try {
        const processos = await processo.getProcessos(id_versao_modelo);
        res.status(200).json(processos);
    } catch (error) {
        console.error(`Erro ao buscar processos: ${error}`);
        res.status(500).json({ message: "Erro ao buscar processos", error: error.message });
    }
});

// Rota para deletar um processo específico
app.delete('/delete_processo/:processo_id', async (req, res) => {
    const { processo_id } = req.params;
    try {
        await processo.deleteProcesso(processo_id);
        res.status(200).json({ message: "Processo deletado com sucesso" });
    } catch (error) {
        console.error(`Erro ao deletar processo: ${error}`);
        res.status(500).json({ message: "Erro ao deletar processo", error: error.message });
    }
});

// Rota para atualizar um processo específico
app.put('/update_processo/:processo_id', async (req, res) => {
    const { processo_id } = req.params;
    const { nova_descricao, novo_tipo } = req.body;
    try {
        await processo.updateProcesso(processo_id, nova_descricao, novo_tipo);
        res.status(200).json({ message: "Processo atualizado com sucesso" });
    } catch (error) {
        console.error(`Erro ao atualizar processo: ${error}`);
        res.status(500).json({ message: "Erro ao atualizar processo", error: error.message });
    }
});

// Rota para adicionar um novo resultado esperado
app.post('/add_resultado_esperado', async (req, res) => {
    const { descricao, id_nivel_intervalo_inicio, id_nivel_intervalo_fim, id_processo } = req.body;
    try {
        await resultadoEsperado.addResultadoEsperado(descricao, id_nivel_intervalo_inicio, id_nivel_intervalo_fim, id_processo);
        res.status(200).json({ message: "Resultado esperado adicionado com sucesso" });
    } catch (error) {
        console.error(`Erro ao adicionar resultado esperado: ${error}`);
        res.status(500).json({ message: "Erro ao adicionar resultado esperado", error: error.message });
    }
});

// Rota para buscar resultados esperados com base em IDs de processos
app.get('/get_resultados_esperados', async (req, res) => {
    const { processosId } = req.query;
    if (!processosId) {
        return res.status(400).json({ message: "Nenhum ID de processo fornecido" });
    }
    const processos_ids_list = processosId.split(',').map(Number);
    try {
        const resultadosEsperados = await resultadoEsperado.getResultadosEsperados(processos_ids_list);
        res.status(200).json(resultadosEsperados);
    } catch (error) {
        console.error(`Erro ao buscar resultados esperados: ${error}`);
        res.status(500).json({ message: "Erro ao buscar resultados esperados", error: error.message });
    }
});

// Rota para deletar um resultado esperado específico
app.delete('/delete_resultado_esperado/:resultado_id', async (req, res) => {
    const { resultado_id } = req.params;
    try {
        await resultadoEsperado.deleteResultadoEsperado(resultado_id);
        res.status(200).json({ message: "Resultado esperado deletado com sucesso" });
    } catch (error) {
        console.error(`Erro ao deletar resultado esperado: ${error}`);
        res.status(500).json({ message: "Erro ao deletar resultado esperado", error: error.message });
    }
});

// Rota para atualizar um resultado esperado específico
app.put('/update_resultado_esperado/:resultado_id', async (req, res) => {
    const { resultado_id } = req.params;
    const { nova_descricao, novo_id_nivel_intervalo_inicio, novo_id_nivel_intervalo_fim, novo_id_processo } = req.body;
    try {
        await resultadoEsperado.updateResultadoEsperado(resultado_id, nova_descricao, novo_id_nivel_intervalo_inicio, novo_id_nivel_intervalo_fim, novo_id_processo);
        res.status(200).json({ message: "Resultado esperado atualizado com sucesso" });
    } catch (error) {
        console.error(`Erro ao atualizar resultado esperado: ${error}`);
        res.status(500).json({ message: "Erro ao atualizar resultado esperado", error: error.message });
    }
});

// Rota para adicionar uma nova avaliação
app.post('/add_avaliacao', async (req, res) => {
    const avaliacaoData = req.body;
    try {
        const { evaluationName, descricao, nivelSolicitado, adjuntoEmails, colaboradorEmails, idVersaoModelo, idUsuario } = avaliacaoData;
        await avaliacao.adicionarAvaliacao(evaluationName, descricao, nivelSolicitado, adjuntoEmails, colaboradorEmails, idUsuario, idVersaoModelo);
        res.status(200).json({ message: "Avaliação adicionada com sucesso" });
    } catch (error) {
        if (error instanceof TypeError) {
            console.error(`Erro: Campo necessário não fornecido - ${error.message}`);
            res.status(400).json({ message: "Campo necessário não fornecido", error: error.message });
        } else {
            console.error(`Erro ao adicionar avaliação: ${error}`);
            res.status(500).json({ message: "Erro ao adicionar avaliação", error: error.message });
        }
    }
});

// Rota para listar as avaliações de um usuário específico
app.get('/listar_avaliacoes/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;
    try {
        const avaliacoes = await avaliacao.listarAvaliacoes(id_usuario);
        res.status(200).json(avaliacoes);
    } catch (error) {
        console.error(`Erro ao listar avaliações: ${error}`);
        res.status(500).json({ message: "Erro ao listar avaliações", error: error.message });
    }
});

// Rota para deletar uma avaliação específica
app.delete('/deletar_avaliacao/:projeto_id', async (req, res) => {
    const { projeto_id } = req.params;
    try {
        await avaliacao.deletarAvaliacao(projeto_id);
        res.status(200).json({ message: "Avaliação deletada com sucesso" });
    } catch (error) {
        console.error(`Erro ao deletar avaliação: ${error}`);
        res.status(500).json({ message: "Erro ao deletar avaliação", error: error.message });
    }
});

// Rota para atualizar uma avaliação específica
app.put('/atualizar_avaliacao/:projeto_id', async (req, res) => {
    const { projeto_id } = req.params;
    const projetoData = req.body;
    try {
        await avaliacao.atualizarAvaliacao(projeto_id, projetoData);
        res.status(200).json({ message: "Avaliação atualizada com sucesso" });
    } catch (error) {
        console.error(`Erro ao atualizar avaliação: ${error}`);
        res.status(500).json({ message: "Erro ao atualizar avaliação", error: error.message });
    }
});

// Rota para atualizar o ID da atividade de uma avaliação específica
app.put('/atualizar_atividade/:projeto_id', async (req, res) => {
    const { projeto_id } = req.params;
    const projetoData = req.body;
    try {
        const novaIdAtividade = projetoData.id_atividade;
        if (!novaIdAtividade) {
            return res.status(400).json({ message: "Campo 'id_atividade' ausente no JSON" });
        }
        await avaliacao.atualizarIdAtividade(projeto_id, novaIdAtividade);
        res.status(200).json({ message: "ID_Atividade atualizada com sucesso" });
    } catch (error) {
        console.error(`Erro ao atualizar ID_Atividade: ${error}`);
        res.status(500).json({ message: "Erro ao atualizar ID_Atividade", error: error.message });
    }
});

// Rota para inserir o planejamento de uma avaliação específica
app.put('/inserir_planejamento/:projeto_id', async (req, res) => {
    const { projeto_id } = req.params;
    const { aprovacaoSoftex, atividadePlanejamento, cronogramaPlanejamento } = req.body;
    try {
        await avaliacao.inserirPlanejamento(projeto_id, aprovacaoSoftex, atividadePlanejamento, cronogramaPlanejamento);
        res.status(200).json({ message: "Planejamento adicionado com sucesso" });
    } catch (error) {
        console.error(`Erro ao adicionar planejamento: ${error}`);
        res.status(500).json({ message: "Erro ao adicionar planejamento", error: error.message });
    }
});

// Rota para obter os dados de uma avaliação específica
app.get('/avaliacao/:projeto_id', async (req, res) => {
    const { projeto_id } = req.params;
    try {
        const avaliacaoData = await avaliacao.obterAvaliacao(projeto_id);
        if (avaliacaoData) {
            res.status(200).json(avaliacaoData);
        } else {
            res.status(404).json({ message: "Avaliação não encontrada" });
        }
    } catch (error) {
        console.error(`Erro ao obter avaliação: ${error}`);
        res.status(500).json({ message: "Erro ao obter avaliação", error: error.message });
    }
});

// Rota para adicionar um novo projeto
app.post('/add_projeto', async (req, res) => {
    const projetoData = req.body;
    try {
        const avaliacaoId = projetoData.avaliacaoId;
        const nomeProjeto = projetoData.nome;
        const habilitado = projetoData.habilitado;
        const numeroProjeto = await projeto.getNextNumeroProjeto(avaliacaoId);
        const projetoId = await projeto.addProjeto(avaliacaoId, nomeProjeto, habilitado, numeroProjeto);
        res.status(200).json({ message: "Projeto adicionado com sucesso", projetoId: projetoId });
    } catch (error) {
        console.error(`Erro ao adicionar projeto: ${error}`);
        if (error instanceof KeyError) {
            res.status(400).json({ message: "Campo necessário não fornecido", error: error.message });
        } else {
            res.status(500).json({ message: "Erro ao adicionar projeto", error: error.message });
        }
    }
});

// Rota para atualizar um projeto existente
app.put('/update_projeto/:projeto_id', async (req, res) => {
    const { projeto_id } = req.params;
    const projetoData = req.body;
    try {
        const nomeProjeto = projetoData.nome;
        const habilitado = projetoData.habilitado;
        await projeto.updateProjeto(projeto_id, nomeProjeto, habilitado);
        res.status(200).json({ message: "Projeto atualizado com sucesso" });
    } catch (error) {
        console.error(`Erro ao atualizar projeto: ${error}`);
        res.status(500).json({ message: "Erro ao atualizar projeto", error: error.message });
    }
});

// Rota para obter projetos por ID de avaliação
app.get('/get_projetos_by_avaliacao/:avaliacao_id', async (req, res) => {
    const { avaliacao_id } = req.params;
    try {
        const projetos = await projeto.getProjetosByIdAvaliacao(avaliacao_id);
        res.status(200).json(projetos);
    } catch (error) {
        console.error(`Erro ao buscar projetos por ID de avaliação: ${error}`);
        res.status(500).json({ message: "Erro ao buscar projetos", error: error.message });
    }
});

// Rota para upload de arquivo
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file part" });
    }

    const filename = req.file.filename;
    res.status(200).json({ filepath: filename });
});

// Rota para visualizar arquivos carregados
app.get('/uploads/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, UPLOAD_FOLDER, filename);
    res.sendFile(filePath);
});

// Rota para adicionar documento
app.post('/add_documento', (req, res) => {
    const documento_data = req.body;
    try {
        const id_projeto = documento_data.id_projeto;
        const caminho_arquivo = documento_data.caminho_arquivo;
        const nome_arquivo = documento_data.nome_arquivo;
        const documento_id = documento.addDocumento(caminho_arquivo, nome_arquivo, id_projeto);
        res.status(200).json({ message: "Documento adicionado com sucesso", documentoId: documento_id });
    } catch (e) {
        console.log(`Erro ao adicionar documento: ${e}`);
        res.status(500).json({ message: "Erro ao adicionar documento", error: e.toString() });
    }
});

// Rota para atualizar documento
app.put('/update_documento/:documento_id', (req, res) => {
    const documento_id = req.params.documento_id;
    const documento_data = req.body;
    try {
        const nome_arquivo = documento_data.nome_arquivo;
        const caminho_arquivo = documento_data.caminho_arquivo;
        documento.updateDocumento(documento_id, nome_arquivo, caminho_arquivo);
        res.status(200).json({ message: "Documento atualizado com sucesso" });
    } catch (e) {
        console.log(`Erro ao atualizar documento: ${e}`);
        res.status(500).json({ message: "Erro ao atualizar documento", error: e.toString() });
    }
});

// Rota para buscar documentos por projeto
app.get('/documentos_por_projeto/:id_projeto', (req, res) => {
    const id_projeto = req.params.id_projeto;
    try {
        const documentos = documento.getDocumentosByProjeto(id_projeto);
        res.status(200).json(documentos);
    } catch (e) {
        console.log(`Erro ao buscar documentos: ${e}`);
        res.status(500).json({ message: "Erro ao buscar documentos", error: e.toString() });
    }
});

// Rota para deletar documento
app.delete('/delete_documento/:documento_id', (req, res) => {
    const documento_id = req.params.documento_id;
    try {
        documento.deleteDocumento(documento_id);
        res.status(200).json({ message: "Documento removido com sucesso" });
    } catch (e) {
        console.log(`Erro ao remover documento: ${e}`);
        res.status(500).json({ message: "Erro ao remover documento", error: e.toString() });
    }
});

// Rota para buscar processos por avaliação
app.get('/get_processos_por_avaliacao/:avaliacao_id/:id_versao_modelo', async (req, res) => {
    const { avaliacao_id, id_versao_modelo } = req.params;
    try {
        const nivel_solicitado_query = "SELECT ID_Nivel_Solicitado FROM avaliacao WHERE ID = ?";
        const [nivel_solicitado_result] = await db.execute(nivel_solicitado_query, [avaliacao_id]);
        const nivel_solicitado = nivel_solicitado_result[0].ID_Nivel_Solicitado;

        const processos_query = `
            SELECT DISTINCT p.ID, p.Descricao 
            FROM processo p
            JOIN resultado_esperado_mpsbr re ON p.ID = re.ID_Processo
            WHERE ? <= re.ID_Nivel_Intervalo_Inicio 
              AND ? >= re.ID_Nivel_Intervalo_Fim 
              AND p.ID_Versao_Modelo = ?
        `;
        const [processos] = await db.execute(processos_query, [nivel_solicitado, nivel_solicitado, id_versao_modelo]);

        res.status(200).json({
            nivel_solicitado,
            processos: processos.map(p => ({ ID: p.ID, Descricao: p.Descricao }))
        });
    } catch (e) {
        console.error(`Erro ao buscar processos por avaliação: ${e}`);
        res.status(500).json({ message: "Erro ao buscar processos", error: e.toString() });
    }
});

// Rota para buscar resultados esperados por processo
app.get('/get_resultados_esperados_por_processo/:processo_id/:avaliacao_id', async (req, res) => {
    const { processo_id, avaliacao_id } = req.params;
    try {
        const nivel_solicitado_query = "SELECT ID_Nivel_Solicitado FROM avaliacao WHERE ID = ?";
        const [nivel_solicitado_result] = await db.execute(nivel_solicitado_query, [avaliacao_id]);
        const nivel_solicitado = nivel_solicitado_result[0].ID_Nivel_Solicitado;

        const query = `
            SELECT re.ID, re.Descricao, re.ID_Processo
            FROM resultado_esperado_mpsbr re
            WHERE re.ID_Processo = ?
              AND ? <= re.ID_Nivel_Intervalo_Inicio 
              AND ? >= re.ID_Nivel_Intervalo_Fim
        `;
        const [resultados] = await db.execute(query, [processo_id, nivel_solicitado, nivel_solicitado]);

        res.status(200).json(resultados.map(r => ({
            ID: r.ID,
            Descricao: r.Descricao,
            ID_Processo: r.ID_Processo
        })));
    } catch (e) {
        console.error(`Erro ao buscar resultados esperados por processo: ${e}`);
        res.status(500).json({ message: "Erro ao buscar resultados esperados", error: e.toString() });
    }
});

// Rota para adicionar uma evidência
app.post('/add_evidencia', async (req, res) => {
    const { id_resultado_esperado, id_documento } = req.body;
    try {
        if (!id_resultado_esperado || !id_documento) {
            return res.status(400).json({ message: "Campos obrigatórios não fornecidos" });
        }
        const query = "INSERT INTO evidencia (ID_Resultado_Esperado, ID_Documento) VALUES (?, ?)";
        await db.execute(query, [id_resultado_esperado, id_documento]);
        res.status(200).json({ message: "Evidência adicionada com sucesso" });
    } catch (error) {
        console.error(`Erro ao adicionar evidência: ${error}`);
        res.status(500).json({ message: "Erro ao adicionar evidência", error: error.toString() });
    }
});

// Rota para buscar evidências por resultado esperado e projeto
app.get('/get_evidencias_por_resultado/:resultado_id/:projeto_id', async (req, res) => {
    const { resultado_id, projeto_id } = req.params;
    try {
        const query = `
            SELECT d.ID, d.Caminho_Arquivo, d.Nome_Arquivo, d.ID_Projeto
            FROM documento d
            JOIN evidencia e ON d.ID = e.ID_Documento
            WHERE e.ID_Resultado_Esperado = ? AND d.ID_Projeto = ?
        `;
        const [documentos] = await db.execute(query, [resultado_id, projeto_id]);
        res.status(200).json(documentos);
    } catch (error) {
        console.error(`Erro ao buscar evidências: ${error}`);
        res.status(500).json({ message: "Erro ao buscar evidências", error: error.toString() });
    }
});

// Rota para atualizar uma evidência
app.put('/update_evidencia/:evidencia_id', async (req, res) => {
    const { evidencia_id } = req.params;
    const { id_resultado_esperado, id_documento } = req.body;
    try {
        if (!id_resultado_esperado || !id_documento) {
            return res.status(400).json({ message: "Campos obrigatórios não fornecidos" });
        }
        const query = "UPDATE evidencia SET ID_Resultado_Esperado = ?, ID_Documento = ? WHERE ID = ?";
        await db.execute(query, [id_resultado_esperado, id_documento, evidencia_id]);
        res.status(200).json({ message: "Evidência atualizada com sucesso" });
    } catch (error) {
        console.error(`Erro ao atualizar evidência: ${error}`);
        res.status(500).json({ message: "Erro ao atualizar evidência", error: error.toString() });
    }
});

// Rota para deletar uma evidência
app.delete('/delete_evidencia/:id_resultado_esperado/:id_documento', async (req, res) => {
    const { id_resultado_esperado, id_documento } = req.params;
    try {
        const query = "DELETE FROM evidencia WHERE ID_Resultado_Esperado = ? AND ID_Documento = ?";
        await db.execute(query, [id_resultado_esperado, id_documento]);
        res.status(200).json({ message: "Evidência deletada com sucesso" });
    } catch (error) {
        console.error(`Erro ao deletar evidência: ${error}`);
        res.status(500).json({ message: "Erro ao deletar evidência", error: error.toString() });
    }
});

// Rota para adicionar ou atualizar grau de implementação
app.post('/add_or_update_grau_implementacao', async (req, res) => {
    const { nota, resultadoId, projetoId } = req.body;
    try {
        if (!nota || !resultadoId || !projetoId) {
            return res.status(400).json({ message: "Campos obrigatórios não fornecidos" });
        }

        // Verificar se já existe uma entrada para o resultado e projeto especificados
        const query = `
            SELECT ID FROM grau_implementacao_processo_projeto 
            WHERE ID_Resultado_Esperado = ? AND ID_Projeto = ?
        `;
        const [result] = await db.execute(query, [resultadoId, projetoId]);

        if (result.length > 0) {
            // Atualizar a entrada existente
            const updateQuery = `
                UPDATE grau_implementacao_processo_projeto
                SET Nota = ?
                WHERE ID_Resultado_Esperado = ? AND ID_Projeto = ?
            `;
            await db.execute(updateQuery, [nota, resultadoId, projetoId]);
        } else {
            // Inserir nova entrada
            const insertQuery = `
                INSERT INTO grau_implementacao_processo_projeto (Nota, ID_Resultado_Esperado, ID_Projeto)
                VALUES (?, ?, ?)
            `;
            await db.execute(insertQuery, [nota, resultadoId, projetoId]);
        }

        res.status(200).json({ message: "Grau de implementação adicionado/atualizado com sucesso" });
    } catch (error) {
        console.error(`Erro ao adicionar/atualizar grau de implementação: ${error}`);
        res.status(500).json({ message: "Erro ao adicionar/atualizar grau de implementação", error: error.toString() });
    }
});

// Rota para buscar graus de implementação por ID da avaliação
app.get('/get_graus_implementacao/:avaliacao_id', async (req, res) => {
    const { avaliacao_id } = req.params;
    try {
        const query = `
            SELECT gip.ID, gip.Nota, gip.ID_Resultado_Esperado, gip.ID_Projeto
            FROM grau_implementacao_processo_projeto gip
            JOIN projeto p ON gip.ID_Projeto = p.ID
            WHERE p.ID_Avaliacao = ?
        `;
        const [graus] = await db.execute(query, [avaliacao_id]);

        const grausImplementacao = graus.map(g => ({
            ID: g.ID,
            Nota: g.Nota,
            ID_Resultado_Esperado: g.ID_Resultado_Esperado,
            ID_Projeto: g.ID_Projeto
        }));

        res.status(200).json(grausImplementacao);
    } catch (error) {
        console.error(`Erro ao buscar graus de implementação: ${error}`);
        res.status(500).json({ message: "Erro ao buscar graus de implementação", error: error.toString() });
    }
});

// Rota para obter todas as versões do modelo
app.get('/get_versao_modelo', async (req, res) => {
    try {
        const versoesModelo = await versaoModelo.getVersaoModelo();
        res.status(200).json(versoesModelo);
    } catch (error) {
        console.error(`Erro ao buscar versao_modelo: ${error}`);
        res.status(500).json({ message: "Erro ao buscar versao_modelo", error: error.toString() });
    }
});

// Rota para adicionar uma nova versão do modelo
app.post('/add_versao_modelo', async (req, res) => {
    try {
        const { nome, status } = req.body;
        await versaoModelo.addVersaoModelo(nome, status);
        res.status(200).json({ message: "Versão do modelo adicionada com sucesso" });
    } catch (error) {
        console.error(`Erro ao adicionar versao_modelo: ${error}`);
        res.status(500).json({ message: "Erro ao adicionar versao_modelo", error: error.toString() });
    }
});

// Rota para deletar uma versão do modelo
app.delete('/delete_versao_modelo/:versao_modelo_id', async (req, res) => {
    const { versao_modelo_id } = req.params;
    try {
        await versaoModelo.deleteVersaoModelo(versao_modelo_id);
        res.status(200).json({ message: "Versão do modelo deletada com sucesso" });
    } catch (error) {
        console.error(`Erro ao deletar versao_modelo: ${error}`);
        res.status(500).json({ message: "Erro ao deletar versao_modelo", error: error.toString() });
    }
});

// Rota para atualizar uma versão do modelo
app.put('/update_versao_modelo/:versao_modelo_id', async (req, res) => {
    const { versao_modelo_id } = req.params;
    const { nome, status } = req.body;
    try {
        await versaoModelo.updateVersaoModelo(nome, status, versao_modelo_id);
        res.status(200).json({ message: "Versão do modelo atualizada com sucesso" });
    } catch (error) {
        console.error(`Erro ao atualizar versao_modelo: ${error}`);
        res.status(500).json({ message: "Erro ao atualizar versao_modelo", error: error.toString() });
    }
});

// Rota para obter todas as empresas
app.get('/get_empresas', async (req, res) => {
    try {
        const empresas = await empresa.getEmpresas();
        res.status(200).json(empresas);
    } catch (error) {
        console.error(`Erro ao buscar empresas: ${error}`);
        res.status(500).json({ error: error.toString() });
    }
});

// Rota para adicionar uma nova empresa
app.post('/add_empresa', async (req, res) => {
    try {
        const { nome, cnpj } = req.body;
        const empresaId = await empresa.addEmpresa(nome, cnpj);
        res.status(201).json({ id: empresaId, message: "Empresa adicionada com sucesso!" });
    } catch (error) {
        console.error(`Erro ao adicionar empresa: ${error}`);
        res.status(500).json({ error: error.toString() });
    }
});

// Rota para atualizar uma empresa
app.put('/update_empresa/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, cnpj } = req.body;
    try {
        await empresa.updateEmpresa(id, nome, cnpj);
        res.status(200).json({ message: "Empresa atualizada com sucesso!" });
    } catch (error) {
        console.error(`Erro ao atualizar empresa: ${error}`);
        res.status(500).json({ error: error.toString() });
    }
});

// Rota para deletar uma empresa
app.delete('/delete_empresa/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await empresa.deleteEmpresa(id);
        res.status(200).json({ message: "Empresa deletada com sucesso!" });
    } catch (error) {
        console.error(`Erro ao deletar empresa: ${error}`);
        res.status(500).json({ error: error.toString() });
    }
});

// Rota para atualizar a empresa em uma avaliação
app.put('/empresa_avaliacao_insert/:avaliacao_id', async (req, res) => {
    const { avaliacao_id } = req.params;
    const { idEmpresa } = req.body;
    try {
        await empresa.empresaAvaliacaoInsert(avaliacao_id, idEmpresa);
        res.status(200).json({ message: "Empresa atualizada com sucesso!" });
    } catch (error) {
        console.error(`Erro ao atualizar empresa na avaliação: ${error}`);
        res.status(500).json({ error: error.toString() });
    }
});

// Rota para obter todas as instituições
app.get('/get_instituicoes', async (req, res) => {
    try {
        const instituicoes = await instituicao.getInstituicoes();
        res.status(200).json(instituicoes);
    } catch (error) {
        console.error(`Erro ao buscar instituições: ${error}`);
        res.status(500).json({ error: error.toString() });
    }
});

// Rota para adicionar uma nova instituição
app.post('/add_instituicao', async (req, res) => {
    const { nome, cnpj } = req.body;
    try {
        const instituicaoId = await instituicao.addInstituicao(nome, cnpj);
        res.status(201).json({ id: instituicaoId, message: "Instituição adicionada com sucesso!" });
    } catch (error) {
        console.error(`Erro ao adicionar instituição: ${error}`);
        res.status(500).json({ error: error.toString() });
    }
});

// Rota para atualizar a instituição em uma avaliação
app.put('/instituicao_avaliacao_insert/:avaliacao_id', async (req, res) => {
    const { avaliacao_id } = req.params;
    const { idInstituicao } = req.body;
    try {
        await instituicao.instituicaoAvaliacaoInsert(avaliacao_id, idInstituicao);
        res.status(200).json({ message: "Instituição atualizada com sucesso!" });
    } catch (error) {
        console.error(`Erro ao atualizar instituição na avaliação: ${error}`);
        res.status(500).json({ error: error.toString() });
    }
});

// Rota para login
app.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Verifica se o email ou a senha estão corretos
        const user = await login.login(email, senha);
        if (user) {
            return res.status(200).json({ message: "Login bem-sucedido" });
        } else {
            return res.status(401).json({ message: "Email ou senha inválidos" });
        }
    } catch (error) {
        console.error(`Erro no login: ${error}`);
        res.status(500).json({ message: `Erro no login: ${error.toString()}` });
    }
});

// Rota para cadastro
app.post('/cadastro', async (req, res) => {
    const { nome, email, senha, cargo } = req.body;

    try {
        console.log(`Dados recebidos: ${JSON.stringify(req.body)}`);
        const { response, status } = await cadastro.cadastrarUsuario(nome, email, senha, cargo);
        res.status(status).json(response);
    } catch (error) {
        console.error(`Erro no cadastro: ${error}`);
        res.status(500).json({ message: `Erro no cadastro: ${error.toString()}` });
    }
});

// Rota para upload do acordo de confidencialidade
app.post('/upload_acordo_confidencialidade/:avaliacao_id', upload.single('file'), async (req, res) => {
    const { avaliacao_id } = req.params;

    if (!req.file) {
        return res.status(400).json({ message: "No file part" });
    }

    const filename = req.file.filename;

    try {
        // Atualizar o campo Caminho_Acordo_Confidencialidade na tabela avaliacao
        const query = "UPDATE avaliacao SET Caminho_Acordo_Confidencialidade = ? WHERE ID = ?";
        const values = [filename, avaliacao_id];
        await db.execute(query, values);

        return res.status(200).json({ message: "Acordo de confidencialidade salvo com sucesso!", filepath: filename });
    } catch (error) {
        console.error(`Erro ao atualizar Caminho_Acordo_Confidencialidade: ${error}`);
        return res.status(500).json({ message: "Erro ao atualizar Caminho_Acordo_Confidencialidade", error: error.toString() });
    }
});

// Rota para buscar o acordo de confidencialidade
app.get('/get_acordo_confidencialidade/:avaliacao_id', async (req, res) => {
    const { avaliacao_id } = req.params;

    try {
        const query = "SELECT Caminho_Acordo_Confidencialidade FROM avaliacao WHERE ID = ?";
        const [result] = await db.execute(query, [avaliacao_id]);

        if (result && result.length && result[0].Caminho_Acordo_Confidencialidade) {
            return res.status(200).json({ filepath: result[0].Caminho_Acordo_Confidencialidade });
        } else {
            return res.status(200).json({ message: "Nenhum acordo de confidencialidade encontrado.", filepath: null });
        }
    } catch (error) {
        console.error(`Erro ao obter Caminho_Acordo_Confidencialidade: ${error}`);
        return res.status(500).json({ message: "Erro ao obter Caminho_Acordo_Confidencialidade", error: error.toString() });
    }
});

// Rota para obter atividades
app.get('/get_atividade', async (req, res) => {
    try {
        const atividades = await atividade.getAtividades();
        return res.status(200).json(atividades);
    } catch (error) {
        console.error(`Erro ao buscar atividades: ${error}`);
        return res.status(500).json({ message: "Erro ao buscar atividades", error: error.toString() });
    }
});

// Rota para enviar e-mail
app.post('/enviar_email/:avaliacao_id', async (req, res) => {
    const { avaliacao_id } = req.params;

    try {
        await email.emailAprovarSoftex(avaliacao_id);
        return res.status(200).json({ message: "E-mail enviado com sucesso" });
    } catch (error) {
        console.error(`Erro ao enviar e-mail: ${error}`);
        return res.status(500).json({ error: error.toString() });
    }
});

// Rota para enviar e-mail solicitando feedback
app.post('/enviar_email_solicitar_feedback/:avaliacao_id', async (req, res) => {
    const { avaliacao_id } = req.params;
    try {
        await email.solicitaLinkFormularioFeedback(avaliacao_id);
        return res.status(200).json({ message: "E-mail Feedback enviado com sucesso" });
    } catch (error) {
        console.error(`Erro ao enviar e-mail de feedback: ${error}`);
        return res.status(500).json({ error: error.toString() });
    }
});

// Rota para adicionar auditores a uma avaliação
app.post('/add_auditor', async (req, res) => {
    const auditorData = req.body;
    try {
        const { idAvaliacao, auditorEmails } = auditorData;
        await auditor.adicionarAuditor(idAvaliacao, auditorEmails);
        return res.status(200).json({ message: "Auditores adicionados com sucesso" });
    } catch (error) {
        console.error(`Erro ao adicionar auditores: ${error}`);
        return res.status(500).json({ message: "Erro ao adicionar auditores", error: error.toString() });
    }
});

// Rota para obter o e-mail do auditor de uma avaliação
app.get('/get_email_auditor/:avaliacao_id', async (req, res) => {
    const { avaliacao_id } = req.params;
    try {
        const emailAuditor = await auditor.getEmailAuditor(avaliacao_id);

        if (emailAuditor) {
            return res.status(200).json({ email: emailAuditor });
        } else {
            return res.status(200).json({ message: "Nenhum auditor cadastrado para esta avaliação" });
        }
    } catch (error) {
        console.error(`Erro ao buscar e-mail do auditor: ${error}`);
        return res.status(500).json({ message: "Erro ao buscar e-mail do auditor", error: error.toString() });
    }
});

// Rota para atualizar o e-mail do auditor
app.put('/update_email_auditor/:avaliacao_id', async (req, res) => {
    const { avaliacao_id } = req.params;
    const { novo_email } = req.body;

    if (!novo_email) {
        return res.status(400).json({ message: "O novo e-mail é obrigatório." });
    }

    try {
        await auditor.updateEmailAuditor(avaliacao_id, novo_email);
        return res.status(200).json({ message: "E-mail do auditor atualizado com sucesso!" });
    } catch (error) {
        console.error(`Erro ao atualizar e-mail do auditor: ${error}`);
        return res.status(500).json({ message: "Erro ao atualizar e-mail do auditor", error: error.toString() });
    }
});

// Rota para salvar a apresentação inicial e status de treinamento da equipe
app.post('/salvar_apresentacao_equipe', async (req, res) => {
    const { idAvaliacao, apresentacaoInicial, equipeTreinada } = req.body;

    if (idAvaliacao === undefined || apresentacaoInicial === undefined || equipeTreinada === undefined) {
        return res.status(400).json({ message: "Dados incompletos" });
    }

    try {
        await avaliacao.salvarApresentacaoEquipe(idAvaliacao, apresentacaoInicial, equipeTreinada);
        return res.status(200).json({ message: "Dados salvos com sucesso" });
    } catch (error) {
        console.error(`Erro ao salvar dados: ${error}`);
        return res.status(500).json({ message: "Erro ao salvar dados" });
    }
});

// Rota para obter os dados de apresentação inicial e status de treinamento da equipe
app.get('/get_apresentacao_equipe/:avaliacao_id', async (req, res) => {
    const { avaliacao_id } = req.params;

    if (!avaliacao_id) {
        return res.status(400).json({ message: "ID da avaliação não fornecido" });
    }

    try {
        const result = await avaliacao.getApresentacaoEquipe(avaliacao_id);

        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ message: "Dados não encontrados" });
        }
    } catch (error) {
        console.error(`Erro ao buscar dados: ${error}`);
        return res.status(500).json({ message: "Erro ao buscar dados" });
    }
});

// Rota para inserir um relatório inicial
app.post('/inserir_relatorio_inicial', async (req, res) => {
    const { descricao, idAvaliacao, caminhoArquivo } = req.body;

    if (!descricao || !idAvaliacao) {
        return res.status(400).json({ message: "Dados incompletos" });
    }

    try {
        const relatorioId = await relatorio.inserirRelatorioInicial(descricao, idAvaliacao, caminhoArquivo);
        return res.status(201).json({ message: "Relatório inserido com sucesso", id: relatorioId });
    } catch (error) {
        console.error(`Erro ao inserir relatório: ${error}`);
        return res.status(500).json({ message: "Erro ao inserir relatório" });
    }
});

// Rota para atualizar um relatório inicial
app.put('/atualizar_relatorio_inicial', async (req, res) => {
    const { descricao, idAvaliacao, caminhoArquivo } = req.body;

    if (!descricao || !idAvaliacao) {
        return res.status(400).json({ message: "Dados incompletos" });
    }

    try {
        await relatorio.atualizarRelatorioInicial(descricao, idAvaliacao, caminhoArquivo);
        return res.status(200).json({ message: "Relatório atualizado com sucesso" });
    } catch (error) {
        console.error(`Erro ao atualizar relatório: ${error}`);
        return res.status(500).json({ message: "Erro ao atualizar relatório" });
    }
});

// Rota para buscar um relatório inicial
app.get('/get_relatorio_inicial/:avaliacao_id', async (req, res) => {
    const { avaliacao_id } = req.params;

    if (!avaliacao_id) {
        return res.status(400).json({ message: "ID da avaliação não fornecido" });
    }

    try {
        const result = await relatorio.obterRelatorioInicial(avaliacao_id);

        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(200).json({ message: "Relatório não encontrado, ainda não foi criado" });
        }
    } catch (error) {
        console.error(`Erro ao buscar relatório: ${error}`);
        return res.status(500).json({ message: "Erro ao buscar relatório" });
    }
});

// Rota para inserir ata de abertura
app.post('/inserir_ata_abertura', async (req, res) => {
    const { descricao, idAvaliacao } = req.body;

    if (!descricao || !idAvaliacao) {
        return res.status(400).json({ message: "Dados incompletos" });
    }

    try {
        const ataId = await relatorio.inserirAtaAbertura(descricao, idAvaliacao);
        return res.status(201).json({ message: "Ata de abertura inserida com sucesso", id: ataId });
    } catch (error) {
        console.error(`Erro ao inserir ata de abertura: ${error}`);
        return res.status(500).json({ message: "Erro ao inserir ata de abertura" });
    }
});

// Rota para atualizar ata de abertura
app.put('/atualizar_ata_abertura', async (req, res) => {
    const { descricao, idAvaliacao } = req.body;

    if (!descricao || !idAvaliacao) {
        return res.status(400).json({ message: "Dados incompletos" });
    }

    try {
        await relatorio.atualizarAtaAbertura(descricao, idAvaliacao);
        return res.status(200).json({ message: "Ata de abertura atualizada com sucesso" });
    } catch (error) {
        console.error(`Erro ao atualizar ata de abertura: ${error}`);
        return res.status(500).json({ message: "Erro ao atualizar ata de abertura" });
    }
});

// Rota para obter ata de abertura
app.get('/get_ata_abertura/:avaliacao_id', async (req, res) => {
    const { avaliacao_id } = req.params;

    if (!avaliacao_id) {
        return res.status(400).json({ message: "ID da avaliação não fornecido" });
    }

    try {
        const result = await relatorio.obterAtaAbertura(avaliacao_id);
        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(200).json({ message: "Ata de abertura não encontrada" });
        }
    } catch (error) {
        console.error(`Erro ao buscar ata de abertura: ${error}`);
        return res.status(500).json({ message: "Erro ao buscar ata de abertura" });
    }
});

// Rota para enviar e-mail ao auditor para avaliação inicial
app.post('/enviar_email_auditor/:avaliacao_id', async (req, res) => {
    const { avaliacao_id } = req.params;

    try {
        // Chama o método da classe Auditor para obter o e-mail
        const emailAuditor = await auditor.getEmailAuditor(avaliacao_id);

        if (emailAuditor) {
            // Chama a função para enviar o e-mail
            await email.enviarEmailAuditorAvaliacaoInicial(avaliacao_id, emailAuditor);
            return res.status(200).json({ message: "E-mail enviado com sucesso!" });
        } else {
            return res.status(404).json({ message: "Auditor não encontrado" });
        }

    } catch (error) {
        console.error(`Erro ao enviar e-mail: ${error}`);
        return res.status(500).json({ error: error.message });
    }
});

// Rota para enviar e-mail ao auditor com a data de avaliação final
app.post('/enviar_email_auditor_data_avaliacao_final/:avaliacao_id', async (req, res) => {
    const { avaliacao_id } = req.params;

    try {
        // Chama o método da classe Auditor para obter o e-mail
        const emailAuditor = await auditor.getEmailAuditor(avaliacao_id);

        if (emailAuditor) {
            // Chama a função para enviar o e-mail
            await email.enviarEmailAuditorDataAvaliacaoFinal(avaliacao_id, emailAuditor);
            return res.status(200).json({ message: "E-mail enviado com sucesso!" });
        } else {
            return res.status(404).json({ message: "Auditor não encontrado" });
        }

    } catch (error) {
        console.error(`Erro ao enviar e-mail: ${error}`);
        return res.status(500).json({ error: error.message });
    }
});

// Rota para notificar participantes sobre o resultado da avaliação inicial
app.post('/notificar_participantes_resultado_avaliacao_inicial/:avaliacao_id', async (req, res) => {
    const { avaliacao_id } = req.params;

    try {
        await email.notificarParticipantesResultadoAvaliacaoInicial(avaliacao_id);
        return res.status(200).json({ message: "E-mail enviado com sucesso!" });
    } catch (error) {
        console.error(`Erro ao enviar e-mail: ${error}`);
        return res.status(500).json({ error: error.message });
    }
});

// Rota para atualizar a empresa durante o ajuste da avaliação inicial
app.put('/update_empresa_ajuste_avaliacao_inicial/:id_empresa', async (req, res) => {
    const { id_empresa } = req.params;
    const { nome } = req.body;

    try {
        await empresa.updateEmpresaAjusteAvaliacaoInicial(id_empresa, nome);
        return res.status(200).json({ message: "Empresa atualizada com sucesso!" });
    } catch (error) {
        console.error(`Erro ao atualizar empresa: ${error}`);
        return res.status(500).json({ message: "Erro ao atualizar empresa", error: error.message });
    }
});

// Rota para atualizar os dados da avaliação durante o ajuste inicial
app.put('/update_avaliacao_ajuste_inicial/:avaliacao_id', async (req, res) => {
    const { avaliacao_id } = req.params;
    const { descricao, cronograma_planejamento, atividade_planejamento } = req.body;

    try {
        await avaliacao.atualizarAvaliacaoAjusteInicial(avaliacao_id, descricao, cronograma_planejamento, atividade_planejamento);
        return res.status(200).json({ message: "Avaliação atualizada com sucesso!" });
    } catch (error) {
        console.error(`Erro ao atualizar avaliação: ${error}`);
        return res.status(500).json({ message: "Erro ao atualizar avaliação", error: error.message });
    }
});

// Rota para atualizar o relatório durante o ajuste inicial da avaliação
app.put('/update_relatorio_ajuste_avaliacao_inicial/:avaliacao_id', async (req, res) => {
    const { avaliacao_id } = req.params;
    const { descricao, caminho_arquivo } = req.body;

    try {
        await relatorio.atualizarRelatorioInicial(descricao, avaliacao_id, caminho_arquivo);
        return res.status(200).json({ message: "Relatório atualizado com sucesso!" });
    } catch (error) {
        console.error(`Erro ao atualizar relatório: ${error}`);
        return res.status(500).json({ message: "Erro ao atualizar relatório", error: error.message });
    }
});

// Rota para adicionar a data de avaliação final
app.post('/add_data_avaliacao', async (req, res) => {
    try {
        const { idAvaliacao, dataAvaliacaoFinal } = req.body;
        await avaliacao.adicionarDataAvaliacaoFinal(idAvaliacao, dataAvaliacaoFinal);
        return res.status(200).json({ message: "Data de avaliação final adicionada com sucesso" });
    } catch (error) {
        console.error(`Erro ao adicionar data de avaliação final: ${error}`);
        return res.status(500).json({ error: error.message });
    }
});

// Rota para obter a data de avaliação final
app.get('/get_data_avaliacao/:idAvaliacao', async (req, res) => {
    const { idAvaliacao } = req.params;
    try {
        const dataAvaliacaoFinal = await avaliacao.obterDataAvaliacaoFinal(idAvaliacao);
        if (dataAvaliacaoFinal) {
            return res.status(200).json({ dataAvaliacaoFinal });
        } else {
            return res.status(404).json({ message: "Data de avaliação final não encontrada" });
        }
    } catch (error) {
        console.error(`Erro ao obter data de avaliação final: ${error}`);
        return res.status(500).json({ error: error.message });
    }
});

// Rota para atualizar a data de avaliação final
app.put('/update_data_avaliacao/:idAvaliacao', async (req, res) => {
    const { idAvaliacao } = req.params;
    const { dataAvaliacaoFinal } = req.body;

    try {
        await avaliacao.atualizarDataAvaliacaoFinal(idAvaliacao, dataAvaliacaoFinal);
        return res.status(200).json({ message: "Data de avaliação final atualizada com sucesso" });
    } catch (error) {
        console.error(`Erro ao atualizar data de avaliação final: ${error}`);
        return res.status(500).json({ error: error.message });
    }
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});