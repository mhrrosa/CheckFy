const bcrypt = require('bcrypt');
const saltRounds = 10; // Número de rounds para o sal

class Cadastro {
    constructor(db) {
        this.db = db;
    }

    async cadastrarUsuario(nome, email, senha, cargo) {
        try {
            // Iniciar transação
            await this.db.beginTransaction();

            // Buscar o ID_Tipo baseado na descrição do cargo
            const queryTipo = "SELECT ID FROM tipo_usuario WHERE Descricao = ?";
            const tipoResult = await this.db.fetchAll(queryTipo, [cargo]);

            if (!tipoResult.length) {
                console.log(`Cargo '${cargo}' não encontrado no banco de dados.`);
                await this.db.rollback();
                return { message: `Cargo '${cargo}' não encontrado.` }, 400;
            }

            const idTipo = tipoResult[0].ID;
            const senhaHash = await bcrypt.hash(senha, saltRounds);

            // Verificar se o e-mail já existe
            const queryEmail = "SELECT ID FROM usuario WHERE Email = ?";
            const emailResult = await this.db.fetchAll(queryEmail, [email]);

            if (emailResult.length > 0) {
                console.log(`E-mail '${email}' já está em uso.`);
                await this.db.rollback();
                return { message: `E-mail '${email}' já está em uso.` }, 400;
            }

            // Executar a query de inserção
            const query = "INSERT INTO usuario (Nome, Email, Senha, ID_Tipo) VALUES (?, ?, ?, ?)";
            const insertResult = await this.db.executeQuery(query, [nome, email, senhaHash, idTipo]);

            // Recuperar o último ID inserido
            const userId = insertResult.insertId;

            // Confirmar transação
            await this.db.commit();

            return { message: "Usuário cadastrado com sucesso!", user_id: userId }, 201;

        } catch (err) {
            await this.db.rollback();
            console.error(`Erro ao cadastrar usuário: ${err.message}`);
            return { message: `Erro ao cadastrar usuário: ${err.message}` }, 500;
        }
    }
}

module.exports = Cadastro;