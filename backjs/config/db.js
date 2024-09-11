const mysql = require('mysql2');

class Database {
    constructor(config) {
        this.config = config;
        this.conn = null;
        this.cursor = null;
        this.connect();
    }

    connect() {
        this.conn = mysql.createConnection(this.config);
        this.conn.connect(err => {
            if (err) {
                console.error('Erro ao conectar ao banco de dados:', err);
                return;
            }
            console.log('Conectado ao banco de dados MySQL');
        });
    }

    reconnect() {
        if (!this.conn || this.conn.state === 'disconnected') {
            this.connect();
        }
    }

    executeQuery(query, params = [], commit = true) {
        return new Promise((resolve, reject) => {
            this.reconnect();
            this.conn.query(query, params, (err, results) => {
                if (err) {
                    console.error('Erro ao executar query:', err);
                    if (commit) this.conn.rollback();
                    reject(err);
                } else {
                    if (commit) this.conn.commit();
                    resolve(results);
                }
            });
        });
    }

    fetchAll(query, params = []) {
        return new Promise((resolve, reject) => {
            this.reconnect();
            this.conn.query(query, params, (err, results) => {
                if (err) {
                    console.error('Erro ao buscar dados:', err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
    beginTransaction() {
        return new Promise((resolve, reject) => {
            this.conn.beginTransaction(err => {
                if (err) {
                    console.error('Erro ao iniciar transação:', err);
                    return reject(err);
                }
                resolve();
            });
        });
    }

    // Confirmar transação
    commit() {
        return new Promise((resolve, reject) => {
            this.conn.commit(err => {
                if (err) {
                    console.error('Erro ao fazer commit da transação:', err);
                    return this.rollback().then(() => reject(err));
                }
                resolve();
            });
        });
    }

    // Reverter transação
    rollback() {
        return new Promise((resolve, reject) => {
            this.conn.rollback(() => {
                resolve();
            });
        });
    }
}

module.exports = { Database };