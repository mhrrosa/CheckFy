class Relatorio:
    def __init__(self, db):
        self.db = db

    def inserir_relatorio_inicial(self, descricao, id_avaliacao):
        try:
            query = """
                INSERT INTO relatorio (Descricao, ID_Tipo, ID_Avaliacao)
                VALUES (%s, %s, %s)
            """
            values = (descricao, 1, id_avaliacao)  # ID_Tipo é sempre 1
            self.db.cursor.execute(query, values)
            self.db.conn.commit()
            return self.db.cursor.lastrowid
        except Exception as e:
            print(f"Erro ao inserir relatório: {e}")
            self.db.conn.rollback()
            raise

    def atualizar_relatorio_inicial(self, descricao, id_avaliacao):
        try:
            query = """
                UPDATE relatorio
                SET Descricao = %s
                WHERE ID_Avaliacao = %s AND ID_Tipo = 1
            """
            values = (descricao, id_avaliacao)
            self.db.cursor.execute(query, values)
            self.db.conn.commit()
        except Exception as e:
            print(f"Erro ao atualizar relatório: {e}")
            self.db.conn.rollback()
            raise

    def obter_relatorio_inicial(self, id_avaliacao):
        try:
            query = """
                SELECT Descricao
                FROM relatorio
                WHERE ID_Avaliacao = %s AND ID_Tipo = 1
            """
            self.db.cursor.execute(query, (id_avaliacao,))
            result = self.db.cursor.fetchone()
            if result:
                return {"descricao": result[0]}
            return None
        except Exception as e:
            print(f"Erro ao obter relatório: {e}")
            raise