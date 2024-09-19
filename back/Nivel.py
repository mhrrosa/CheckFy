class Nivel:
    def __init__(self, db):
        self.db = db

    def add_nivel(self, nivel, nome_nivel, id_versao_modelo):
        try:
            self.db.cursor.execute("INSERT INTO nivel_maturidade_mpsbr (Nivel, Nome_Nivel, id_versao_modelo) VALUES (%s, %s, %s)", (nivel, nome_nivel, id_versao_modelo))
            self.db.conn.commit()
        except Exception as e:
            print(f"Erro ao adicionar nivel ao banco de dados: {e}")
            raise e
        
    def get_niveis(self, id_versao_modelo):
        self.db.cursor.execute("SELECT * FROM nivel_maturidade_mpsbr where ID_Versao_Modelo = %s ORDER BY Nivel", (id_versao_modelo,))
        result = self.db.cursor.fetchall()
        return result
    
    def get_niveis_limitado(self, id_versao_modelo, id_nivel_solicitado):
        # Busca os níveis da versão do modelo limitados até o ID do nível solicitado
        self.db.cursor.execute("""
            SELECT * FROM nivel_maturidade_mpsbr 
            WHERE ID_Versao_Modelo = %s AND Nivel >= 
                (SELECT Nivel FROM nivel_maturidade_mpsbr WHERE ID = %s)
            ORDER BY Nivel ASC
        """, (id_versao_modelo, id_nivel_solicitado))
        result = self.db.cursor.fetchall()
        return result

    def delete_nivel(self, nivel_id):
        self.db.cursor.execute("DELETE FROM nivel_maturidade_mpsbr WHERE ID = %s", (nivel_id,))
        self.db.conn.commit()

    def update_nivel(self, nivel_id, novo_nivel, novo_nome_nivel):
        self.db.cursor.execute("UPDATE nivel_maturidade_mpsbr SET Nivel = %s, Nome_Nivel = %s WHERE ID = %s", (novo_nivel, novo_nome_nivel, nivel_id))
        self.db.conn.commit()