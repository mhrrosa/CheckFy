class Processo:
    def __init__(self, db):
        self.db = db

    def add_processo(self, descricao, tipo, id_versao_modelo):
        try:
            self.db.cursor.execute("INSERT INTO processo (Descricao, Tipo, ID_Versao_Modelo) VALUES (%s, %s, %s)", (descricao, tipo, id_versao_modelo))
            self.db.conn.commit()
        except Exception as e:
            print(f"Erro ao adicionar processo ao banco de dados: {e}")
            raise e

    def get_processos(self, id_versao_modelo: int):
        self.db.cursor.execute("SELECT * FROM processo where ID_Versao_Modelo = %s ORDER BY id", (id_versao_modelo,))
        result = self.db.cursor.fetchall()
        return result

    def delete_processo(self, processo_id):
        try:
            self.db.cursor.execute("DELETE FROM processo WHERE ID = %s", (processo_id,))
            self.db.conn.commit()
        except Exception as e:
            print(f"Erro ao deletar processo: {e}")
            raise e

    def update_processo(self, processo_id, nova_descricao, novo_tipo):
        self.db.cursor.execute("UPDATE processo SET Descricao = %s, Tipo = %s WHERE ID = %s",
                               (nova_descricao, novo_tipo, processo_id))
        self.db.conn.commit()
