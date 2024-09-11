class Documento {
    constructor(db) {
        this.db = db;
    }

    async addDocumento(caminhoArquivo, nomeArquivo, idProjeto) {
        const query = `
            INSERT INTO documento (Caminho_Arquivo, Nome_Arquivo, ID_Projeto) 
            VALUES (?, ?, ?)
        `;
        try {
            const result = await this.db.executeQuery(query, [caminhoArquivo, nomeArquivo, idProjeto]);
            const documentoId = result.insertId;
            this.db.conn.commit();
            return documentoId;
        } catch (err) {
            console.error("Erro ao adicionar documento:", err);
            this.db.conn.rollback();
            throw err;
        }
    }

    async updateDocumento(documentoId, nomeArquivo, caminhoArquivo) {
        const query = `
            UPDATE documento 
            SET Nome_Arquivo = ?, Caminho_Arquivo = ? 
            WHERE ID = ?
        `;
        try {
            await this.db.executeQuery(query, [nomeArquivo, caminhoArquivo, documentoId]);
            this.db.conn.commit();
        } catch (err) {
            console.error("Erro ao atualizar documento:", err);
            this.db.conn.rollback();
            throw err;
        }
    }

    async deleteDocumento(documentoId) {
        try {
            // Deletar as referências na tabela 'evidencia'
            const deleteEvidenciaQuery = "DELETE FROM evidencia WHERE ID_Documento = ?";
            await this.db.executeQuery(deleteEvidenciaQuery, [documentoId]);

            // Deletar o documento na tabela 'documento'
            const deleteDocumentoQuery = "DELETE FROM documento WHERE ID = ?";
            await this.db.executeQuery(deleteDocumentoQuery, [documentoId]);

            this.db.conn.commit();
        } catch (err) {
            console.error("Erro ao deletar documento:", err);
            this.db.conn.rollback();
            throw err;
        }
    }

    async getDocumentosByProjeto(idProjeto) {
        const query = "SELECT * FROM documento WHERE ID_Projeto = ?";
        try {
            const documentos = await this.db.fetchAll(query, [idProjeto]);
            return documentos;
        } catch (err) {
            console.error("Erro ao buscar documentos por projeto:", err);
            throw err;
        }
    }
}

module.exports = Documento;