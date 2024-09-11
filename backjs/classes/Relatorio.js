class Relatorio {
    constructor(db) {
        this.db = db;
    }

    async inserirRelatorioInicial(descricao, idAvaliacao, caminhoArquivo) {
        const query = `
            INSERT INTO relatorio (Descricao, ID_Tipo, ID_Avaliacao, Caminho_Arquivo)
            VALUES (?, ?, ?, ?)
        `;
        const values = [descricao, 1, idAvaliacao, caminhoArquivo];
        try {
            await this.db.executeQuery(query, values);
            const lastId = await this.db.getLastInsertId(); // Função que retorna o último ID inserido
            return lastId;
        } catch (err) {
            console.error("Erro ao inserir relatório inicial:", err);
            throw err;
        }
    }

    async atualizarRelatorioInicial(descricao, idAvaliacao, caminhoArquivo) {
        const query = `
            UPDATE relatorio
            SET Descricao = ?, Caminho_Arquivo = ?
            WHERE ID_Avaliacao = ? AND ID_Tipo = 1
        `;
        const values = [descricao, caminhoArquivo, idAvaliacao];
        try {
            await this.db.executeQuery(query, values);
        } catch (err) {
            console.error("Erro ao atualizar relatório inicial:", err);
            throw err;
        }
    }

    async obterRelatorioInicial(idAvaliacao) {
        const query = `
            SELECT Descricao, Caminho_Arquivo
            FROM relatorio
            WHERE ID_Avaliacao = ? AND ID_Tipo = 1
        `;
        try {
            const result = await this.db.fetchOne(query, [idAvaliacao]);
            if (result) {
                return { descricao: result.Descricao, caminhoArquivo: result.Caminho_Arquivo };
            }
            return null;
        } catch (err) {
            console.error("Erro ao obter relatório inicial:", err);
            throw err;
        }
    }

    // Métodos para ata de reunião de abertura
    async inserirAtaAbertura(descricao, idAvaliacao) {
        const query = `
            INSERT INTO relatorio (Descricao, ID_Tipo, ID_Avaliacao, Caminho_Arquivo)
            VALUES (?, ?, ?, ?)
        `;
        const values = [descricao, 2, idAvaliacao, 'não existe'];
        try {
            await this.db.executeQuery(query, values);
            const lastId = await this.db.getLastInsertId(); // Função que retorna o último ID inserido
            return lastId;
        } catch (err) {
            console.error("Erro ao inserir ata de abertura:", err);
            throw err;
        }
    }

    async atualizarAtaAbertura(descricao, idAvaliacao) {
        const query = `
            UPDATE relatorio
            SET Descricao = ?, Caminho_Arquivo = ?
            WHERE ID_Avaliacao = ? AND ID_Tipo = 2
        `;
        const values = [descricao, 'não existe', idAvaliacao];
        try {
            await this.db.executeQuery(query, values);
        } catch (err) {
            console.error("Erro ao atualizar ata de abertura:", err);
            throw err;
        }
    }

    async obterAtaAbertura(idAvaliacao) {
        const query = `
            SELECT Descricao, Caminho_Arquivo
            FROM relatorio
            WHERE ID_Avaliacao = ? AND ID_Tipo = 2
        `;
        try {
            const result = await this.db.fetchOne(query, [idAvaliacao]);
            if (result) {
                return { descricao: result.Descricao, caminhoArquivo: result.Caminho_Arquivo };
            }
            return null;
        } catch (err) {
            console.error("Erro ao obter ata de abertura:", err);
            throw err;
        }
    }
}

module.exports = Relatorio;