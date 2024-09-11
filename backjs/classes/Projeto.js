class Projeto {
    constructor(db) {
        this.db = db;
    }

    async addProjeto(idAvaliacao, nomeProjeto, projetoHabilitado, numeroProjeto) {
        const query = "INSERT INTO projeto (ID_Avaliacao, Nome_Projeto, Projeto_Habilitado, Numero_Projeto) VALUES (?, ?, ?, ?)";
        try {
            await this.db.executeQuery(query, [idAvaliacao, nomeProjeto, projetoHabilitado, numeroProjeto]);
            const lastId = await this.db.getLastInsertId(); // Função que retorna o último ID inserido
            return lastId;
        } catch (err) {
            console.error("Erro ao adicionar projeto:", err);
            throw err;
        }
    }

    async getProjetosByIdAvaliacao(idAvaliacao) {
        const queryProjetos = "SELECT * FROM projeto WHERE ID_Avaliacao = ?";
        try {
            const projetos = await this.db.fetchAll(queryProjetos, [idAvaliacao]);

            const projetosComDocumentos = await Promise.all(projetos.map(async (projeto) => {
                const queryDocumentos = `
                    SELECT d.ID, d.Caminho_Arquivo, d.Nome_Arquivo, d.ID_Projeto 
                    FROM documento d 
                    WHERE d.ID_Projeto = ?
                `;
                const documentos = await this.db.fetchAll(queryDocumentos, [projeto.ID]);
                return {
                    ID: projeto.ID,
                    ID_Avaliacao: projeto.ID_Avaliacao,
                    Projeto_Habilitado: projeto.Projeto_Habilitado,
                    Numero_Projeto: projeto.Numero_Projeto,
                    Nome_Projeto: projeto.Nome_Projeto,
                    Documentos: documentos.map((doc) => ({
                        ID: doc.ID,
                        Caminho_Arquivo: doc.Caminho_Arquivo,
                        Nome_Arquivo: doc.Nome_Arquivo,
                        ID_Projeto: doc.ID_Projeto
                    }))
                };
            }));

            return projetosComDocumentos;
        } catch (err) {
            console.error("Erro ao buscar projetos:", err);
            throw err;
        }
    }

    async updateProjeto(projetoId, nomeProjeto, projetoHabilitado) {
        const query = "UPDATE projeto SET Nome_Projeto = ?, Projeto_Habilitado = ? WHERE ID = ?";
        try {
            await this.db.executeQuery(query, [nomeProjeto, projetoHabilitado, projetoId]);
        } catch (err) {
            console.error("Erro ao atualizar projeto:", err);
            throw err;
        }
    }

    async getNextNumeroProjeto(idAvaliacao) {
        const query = "SELECT MAX(Numero_Projeto) FROM projeto WHERE ID_Avaliacao = ?";
        try {
            const result = await this.db.fetchOne(query, [idAvaliacao]);
            return (result ? result["MAX(Numero_Projeto)"] : 0) + 1;
        } catch (err) {
            console.error("Erro ao obter o próximo número de projeto:", err);
            throw err;
        }
    }
}

module.exports = Projeto;