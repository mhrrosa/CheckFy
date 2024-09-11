class Avaliacao {
    constructor(db) {
        this.db = db;
    }

    async adicionarAvaliacao(nome, descricao, idNivelSolicitado, adjuntoEmails, colaboradorEmails, idUsuario, idVersaoModelo) {
        try {
            const query = `
                INSERT INTO avaliacao (Nome, Descricao, Status, ID_Nivel_Solicitado, ID_Avaliador_Lider, ID_Atividade, ID_Versao_Modelo) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const values = [nome, descricao, "Em andamento", idNivelSolicitado, idUsuario, 1, idVersaoModelo];
            await this.db.executeQuery(query, values);
            const idAvaliacao = this.db.conn.lastInsertId;

            // Inserir o criador da avaliação na tabela usuarios_avaliacao
            const queryUsuario = `
                INSERT INTO usuarios_avaliacao (ID_Avaliacao, ID_Usuario, ID_Funcao) 
                VALUES (?, ?, ?)
            `;
            await this.db.executeQuery(queryUsuario, [idAvaliacao, idUsuario, 1]);

            const inserirOuLinkarUsuario = async (email, idFuncao) => {
                // Verificar se o usuário já existe
                let query = "SELECT ID FROM usuario WHERE Email = ?";
                const [usuario] = await this.db.fetchAll(query, [email]);

                if (usuario) {
                    // Usuário já existe, linkar à avaliação
                    query = "INSERT INTO usuarios_avaliacao (ID_Avaliacao, ID_Usuario, ID_Funcao) VALUES (?, ?, ?)";
                    await this.db.executeQuery(query, [idAvaliacao, usuario.ID, idFuncao]);
                } else {
                    // Usuário não existe, inserir e linkar à avaliação
                    query = "INSERT INTO usuario (Nome, Email, Senha, ID_Tipo) VALUES (?, ?, ?, ?)";
                    await this.db.executeQuery(query, ["Usuário", email, "senha", idFuncao]);
                    const novoUsuarioId = this.db.conn.lastInsertId;

                    // Linkar o novo usuário à avaliação
                    query = "INSERT INTO usuarios_avaliacao (ID_Avaliacao, ID_Usuario, ID_Funcao) VALUES (?, ?, ?)";
                    await this.db.executeQuery(query, [idAvaliacao, novoUsuarioId, idFuncao]);
                    
                    console.log(`Simulação de envio de e-mail para ${email} solicitando cadastro no sistema.`);
                }
            };

            for (let email of adjuntoEmails) {
                await inserirOuLinkarUsuario(email, 2);  // 2 = Avaliadores Adjuntos
            }

            for (let email of colaboradorEmails) {
                await inserirOuLinkarUsuario(email, 5);  // 5 = Colaboradores Empresariais
            }

            this.db.conn.commit();
        } catch (err) {
            console.error('Erro ao adicionar avaliação:', err);
            this.db.conn.rollback();
            throw err;
        }
    }

    async listarAvaliacoes(idAvaliador) {
        try {
            const queryIds = "SELECT ID_Avaliacao FROM usuarios_avaliacao WHERE ID_Usuario = ?";
            const avaliacaoIds = await this.db.fetchAll(queryIds, [idAvaliador]);

            if (!avaliacaoIds.length) {
                console.log("Nenhum ID de avaliação encontrado");
                return [];
            }

            const ids = avaliacaoIds.map(row => row.ID_Avaliacao);
            const placeholders = ids.map(() => '?').join(',');
            const query = `SELECT * FROM avaliacao WHERE ID IN (${placeholders})`;

            const result = await this.db.fetchAll(query, ids);

            const avaliacoes = result.map(row => ({
                id: row.ID,
                nome: row.Nome,
                descricao: row.Descricao,
                id_avaliador_lider: row.ID_Avaliador_Lider,
                status: row.Status,
                id_atividade: row.ID_Atividade,
                id_empresa: row.ID_Empresa,
                id_nivel_solicitado: row.ID_Nivel_Solicitado,
                id_versao_modelo: row.ID_Versao_Modelo,
            }));

            return avaliacoes;
        } catch (err) {
            console.error('Erro ao listar avaliações:', err);
            throw err;
        }
    }

    async obterAvaliacao(projetoId) {
        try {
            const query = `
                SELECT a.ID, a.Nome, a.Descricao, a.ID_Avaliador_Lider, u.Nome, 
                    a.Status, atv.Descricao, a.ID_Empresa, e.Nome, n.Nivel, 
                    v.Nome, a.ID_Instituicao, a.Atividade_Planejamento, 
                    a.Cronograma_Planejamento, a.Avaliacao_Aprovada_Pela_Softex,
                    a.ID_Atividade, a.ID_Nivel_Solicitado, a.ID_Versao_Modelo,
                    r.descricao AS descricao_relatorio, r.Caminho_Arquivo AS caminho_arquivo_relatorio, tr.descricao AS tipo_relatorio
                FROM avaliacao a
                LEFT JOIN empresa e ON a.ID_Empresa = e.ID
                LEFT JOIN nivel_maturidade_mpsbr n ON a.ID_Nivel_Solicitado = n.ID
                LEFT JOIN usuario u ON a.ID_Avaliador_Lider = u.ID
                LEFT JOIN versao_modelo v ON a.ID_Versao_Modelo = v.ID
                LEFT JOIN atividade atv ON a.ID_Atividade = atv.ID
                LEFT JOIN relatorio r ON a.ID = r.ID_Avaliacao
                LEFT JOIN tipo_relatorio tr ON r.ID_Tipo = tr.ID
                WHERE a.ID = ?
            `;

            const [row] = await this.db.fetchAll(query, [projetoId]);

            if (row) {
                return {
                    id: row.ID,
                    nome: row.Nome,
                    descricao: row.Descricao,
                    id_avaliador_lider: row.ID_Avaliador_Lider,
                    nome_avaliador_lider: row.Nome_Avaliador_Lider,
                    status: row.Status,
                    descricao_atividade: row.Descricao_Atividade,
                    id_empresa: row.ID_Empresa,
                    nome_empresa: row.Nome_Empresa,
                    nivel_solicitado: row.Nivel,
                    nome_versao_modelo: row.Nome_Versao_Modelo,
                    id_instituicao: row.ID_Instituicao,
                    atividade_planejamento: row.Atividade_Planejamento,
                    cronograma_planejamento: row.Cronograma_Planejamento,
                    aprovacao_softex: row.Avaliacao_Aprovada_Pela_Softex,
                    id_atividade: row.ID_Atividade,
                    id_nivel_solicitado: row.ID_Nivel_Solicitado,
                    id_versao_modelo: row.ID_Versao_Modelo,
                    descricao_relatorio_ajuste_inicial: row.descricao_relatorio,
                    caminho_arquivo_relatorio_ajuste_inicial: row.caminho_arquivo_relatorio,
                    tipo_relatorio_ajuste_inicial: row.tipo_relatorio
                };
            }

            console.log("Erro: A consulta não retornou os campos esperados.");
            return null;
        } catch (err) {
            console.error('Erro ao obter avaliação:', err);
            throw err;
        }
    }

    async deletarAvaliacao(projetoId) {
        try {
            const query = "DELETE FROM avaliacao WHERE ID = ?";
            await this.db.executeQuery(query, [projetoId]);
            this.db.conn.commit();
        } catch (err) {
            console.error('Erro ao deletar avaliação:', err);
            this.db.conn.rollback();
            throw err;
        }
    }

    async atualizarAvaliacao(projetoId, novoNome, novaDescricao, novoIdAvaliadorLider, novoStatus, novoModelo, novoIdAtividade, novoIdEmpresa, novoIdNivelSolicitado, novoIdNivelAtribuido, novoPareceNivelFinal) {
        try {
            const query = `
                UPDATE avaliacao 
                SET Nome = ?, Descricao = ?, ID_Avaliador_Lider = ?, Status = ?, Modelo = ?, ID_Atividade = ?, ID_Empresa = ?, ID_Nivel_Solicitado = ?, ID_Nivel_Atribuido = ?, Parece_Nivel_Final = ? 
                WHERE ID = ?
            `;
            const values = [novoNome, novaDescricao, novoIdAvaliadorLider, novoStatus, novoModelo, novoIdAtividade, novoIdEmpresa, novoIdNivelSolicitado, novoIdNivelAtribuido, novoPareceNivelFinal, projetoId];
            await this.db.executeQuery(query, values);
            this.db.conn.commit();
        } catch (err) {
            console.error('Erro ao atualizar avaliação:', err);
            this.db.conn.rollback();
            throw err;
        }
    }

    async atualizarIdAtividade(projetoId, novaIdAtividade) {
        try {
            const query = "UPDATE avaliacao SET ID_Atividade = ? WHERE ID = ?";
            await this.db.executeQuery(query, [novaIdAtividade, projetoId]);
            this.db.conn.commit();
        } catch (err) {
            console.error("Erro ao atualizar ID da Atividade:", err);
            this.db.conn.rollback();
            throw err;
        }
    }

    async inserirPlanejamento(projetoId, aprovacaoSoftex, atividadePlanejamento, cronogramaPlanejamento) {
        try {
            const query = `
                UPDATE avaliacao 
                SET Avaliacao_Aprovada_Pela_Softex = ?, Atividade_Planejamento = ?, Cronograma_Planejamento = ? 
                WHERE ID = ?
            `;
            await this.db.executeQuery(query, [aprovacaoSoftex, atividadePlanejamento, cronogramaPlanejamento, projetoId]);
            this.db.conn.commit();
        } catch (err) {
            console.error("Erro ao inserir planejamento:", err);
            this.db.conn.rollback();
            throw err;
        }
    }

    async salvarApresentacaoEquipe(idAvaliacao, apresentacaoInicial, equipeTreinada) {
        try {
            const query = `
                UPDATE avaliacao 
                SET Apresentacao_Inicial = ?, Equipe_Treinada = ?
                WHERE ID = ?
            `;
            await this.db.executeQuery(query, [apresentacaoInicial, equipeTreinada, idAvaliacao]);
            this.db.conn.commit();
        } catch (err) {
            console.error("Erro ao salvar apresentação inicial e equipe treinada:", err);
            this.db.conn.rollback();
            throw err;
        }
    }

    async getApresentacaoEquipe(idAvaliacao) {
        try {
            const query = `
                SELECT Apresentacao_Inicial, Equipe_Treinada 
                FROM avaliacao 
                WHERE ID = ?
            `;
            const [result] = await this.db.fetchAll(query, [idAvaliacao]);

            if (result) {
                return {
                    apresentacao_inicial: Boolean(result.Apresentacao_Inicial),
                    equipe_treinada: Boolean(result.Equipe_Treinada)
                };
            }
            return null;
        } catch (err) {
            console.error("Erro ao buscar apresentação inicial e equipe treinada:", err);
            throw err;
        }
    }

    async atualizarAvaliacaoAjusteInicial(avaliacaoId, descricao, cronogramaPlanejamento, atividadePlanejamento) {
        try {
            const query = `
                UPDATE avaliacao 
                SET Descricao = ?, Cronograma_Planejamento = ?, Atividade_Planejamento = ? 
                WHERE ID = ?
            `;
            await this.db.executeQuery(query, [descricao, cronogramaPlanejamento, atividadePlanejamento, avaliacaoId]);
            this.db.conn.commit();
        } catch (err) {
            console.error("Erro ao atualizar ajuste inicial:", err);
            this.db.conn.rollback();
            throw err;
        }
    }

    async adicionarDataAvaliacaoFinal(idAvaliacao, dataAvaliacaoFinal) {
        try {
            const query = "UPDATE avaliacao SET data_avaliacao_final = ? WHERE ID = ?";
            await this.db.executeQuery(query, [dataAvaliacaoFinal, idAvaliacao]);
            this.db.conn.commit();
        } catch (err) {
            console.error("Erro ao adicionar data da avaliação final:", err);
            this.db.conn.rollback();
            throw err;
        }
    }

    async obterDataAvaliacaoFinal(idAvaliacao) {
        try {
            const query = "SELECT data_avaliacao_final FROM avaliacao WHERE ID = ?";
            const [result] = await this.db.fetchAll(query, [idAvaliacao]);

            return result ? result.data_avaliacao_final : null;
        } catch (err) {
            console.error("Erro ao obter data da avaliação final:", err);
            throw err;
        }
    }

    async atualizarDataAvaliacaoFinal(idAvaliacao, novaDataAvaliacaoFinal) {
        try {
            const query = "UPDATE avaliacao SET data_avaliacao_final = ? WHERE ID = ?";
            await this.db.executeQuery(query, [novaDataAvaliacaoFinal, idAvaliacao]);
            this.db.conn.commit();
        } catch (err) {
            console.error("Erro ao atualizar data da avaliação final:", err);
            this.db.conn.rollback();
            throw err;
        }
    }
}

module.exports = Avaliacao;