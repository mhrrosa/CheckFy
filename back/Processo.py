class Processo:
    def __init__(self, db):
        self.db = db

    def add_processo(self, descricao, tipo):
        try:
            self.db.cursor.execute("INSERT INTO processo (Descricao, Tipo) VALUES (%s, %s)", (descricao, tipo))
            self.db.conn.commit()
        except Exception as e:
            print(f"Erro ao adicionar processo ao banco de dados: {e}")
            raise e

    def get_all_processos(self):
        query = "SELECT * FROM processo ORDER BY id"
        print(f"Executando query: {query}")
        self.db.cursor.execute(query)
        result = self.db.cursor.fetchall()
        return result

    def delete_processo(self, processo_id):
        try:
            print(f"Deletando processo com ID: {processo_id}")
            self.db.cursor.execute("DELETE FROM processo WHERE ID = %s", (processo_id,))
            self.db.conn.commit()
            print(f"Processo com ID {processo_id} deletado com sucesso.")
        except Exception as e:
            print(f"Erro ao deletar processo: {e}")
            raise e

    def update_processo(self, processo_id, nova_descricao, novo_tipo):
        self.db.cursor.execute("UPDATE processo SET Descricao = %s, Tipo = %s WHERE ID = %s",
                               (nova_descricao, novo_tipo, processo_id))
        self.db.conn.commit()
