class GrauImplementacao:
    def __init__(self, db):
        self.db = db

    def add_graus_implementacao_empresa(self, valores):
        query = """
        INSERT INTO grau_implementacao_processo_unidade_organizacional 
        (ID_Avaliacao, ID_Resultado_Esperado, Nota) 
        VALUES (%s, %s, %s)
        """
        try:
            # Execute muitos valores ao mesmo tempo
            self.db.cursor.executemany(query, valores)
            self.db.conn.commit()
        except Exception as e:
            print(f"Erro ao adicionar os graus de implementação: {e}")
            self.db.conn.rollback()
            raise

    def get_grau_implementacao_empresa(self, id_avaliacao):
        try:
            query_graus = "SELECT * FROM grau_implementacao_processo_unidade_organizacional WHERE ID_Avaliacao = %s"
            self.db.cursor.execute(query_graus, (id_avaliacao,))
            graus = self.db.cursor.fetchall()

            # Verificar se a consulta retornou algo
            if not graus:
                return None  # Retorna uma mensagem informando que não encontrou nada
            
            graus_implementacao = []
            for grau in graus:
                grau_dict = {
                    'ID': grau[0],
                    'ID_Avaliacao': grau[1],
                    'ID_Resultado_Esperado': grau[2],
                    'Nota': grau[3],
                }
                graus_implementacao.append(grau_dict)

            return graus_implementacao

        except Exception as e:
            print(f"Erro ao buscar graus de implementação: {e}")
            raise

    def update_grau_implementacao_empresa(self, id_grau, nota):
        query = "UPDATE grau_implementacao_processo_unidade_organizacional SET Nota = %s WHERE ID = %s"
        self.db.cursor.execute(query, (nota, id_grau))
        self.db.conn.commit()
