class Versao_Modelo:
    def __init__(self, db):
        self.db = db

    def add_versao_modelo(self, nome, status):
        try:
            self.db.cursor.execute("INSERT INTO versao_modelo (Nome, Status) VALUES (%s, %s)", (nome, status))
            self.db.conn.commit()
        except Exception as e:
            print(f"Erro ao adicionar versao do modelo ao banco de dados: {e}")
            raise e

    def get_versao_modelo(self):
        query = "SELECT * FROM processo ORDER BY id"
        print(f"Executando query: {query}")
        self.db.cursor.execute(query)
        result = self.db.cursor.fetchall()
        return result

    def delete_versao_modelo(self, versao_modelo_id):
        try:
            self.db.cursor.execute("DELETE FROM versao_modelo WHERE ID = %s", (versao_modelo_id,))
            self.db.conn.commit()
        except Exception as e:
            print(f"Erro ao deletar versao_modelo: {e}")
            raise e

    def update_versao_modelo(self, nome, status, id):
        self.db.cursor.execute("UPDATE versao_modelo SET Nome = %s, Status = %s WHERE ID = %s", (nome, status, id))
        self.db.conn.commit()
