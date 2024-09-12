class GrauImplementacao:
    def __init__(self, db):
        self.db = db

    def add_grau_implementacao_empresa(self, id_avaliacao, id_resultado_esperado, nota):
        query = "INSERT INTO grau_implementacao_processo_unidade_organizacional (ID_Avaliacao, ID_Resultado_Esperado, Nota) VALUES (%s, %s, %s)"
        try:
            self.db.cursor.execute(query, (id_avaliacao, id_resultado_esperado, nota))
            self.db.conn.commit()
            return self.db.cursor.lastrowid
        except Exception as e:
            print(f"Erro ao adicionar projeto: {e}")
            self.db.conn.rollback()
            raise

    def get_grau_implementacao_empresa(self, id_avaliacao):
        query_graus = "SELECT * FROM grau_implementacao_processo_unidade_organizacional WHERE ID_Avaliacao = %s"
        
        self.db.cursor.execute(query_graus, (id_avaliacao,))
        graus = self.db.cursor.fetchall()

        graus_implementacao = []
        for grau in graus:
            grau.append({
                'ID': grau[0],
                'ID_Avaliacao': grau[1],
                'ID_Resultado_Esperado': grau[2],
                'Nota': grau[3],
            })

        return graus_implementacao

    def update_grau_implementacao_empresa(self, id_grau, nota):
        query = "UPDATE grau_implementacao_processo_unidade_organizacional SET Nota = %s WHERE ID = %s"
        self.db.cursor.execute(query, (nota, id_grau))
        self.db.conn.commit()
