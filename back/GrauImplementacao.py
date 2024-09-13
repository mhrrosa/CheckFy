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
                    'ID_Resultado_Esperado': grau[1],
                    'Nota': grau[2],
                    'ID_Avaliacao': grau[3],
                }
                graus_implementacao.append(grau_dict)

            return graus_implementacao

        except Exception as e:
            print(f"Erro ao buscar graus de implementação: {e}")
            raise

    def update_graus_implementacao_empresa_batch(self, update_data):
        query = """
            UPDATE grau_implementacao_processo_unidade_organizacional
            SET Nota = %s
            WHERE ID_Avaliacao = %s AND ID_Resultado_Esperado = %s
        """
        try:
            # Executa o update para cada item no batch
            self.db.cursor.executemany(query, update_data)
            self.db.conn.commit()
        except Exception as e:
            print(f"Erro ao atualizar grau de implementação: {e}")
            self.db.conn.rollback()
            raise
