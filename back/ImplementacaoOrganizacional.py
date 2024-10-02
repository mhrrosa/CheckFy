class ImplementacaoOrganizacional:
    def __init__(self, db):
        self.db = db

    def get_perguntas(self, id_nivel):
        cursor = self.db.conn.cursor(dictionary=True)
        try:
            query_perguntas = "SELECT * FROM perguntas_capacidade_processo_organizacional WHERE ID_Nivel = %s"
            cursor.execute(query_perguntas, (id_nivel,))
            perguntas = cursor.fetchall()
            # Verificar se a consulta retornou algo
            if not perguntas:
                return None  # Retorna uma mensagem informando que não encontrou nada
            
            perguntas_implementacao = []
            for pergunta in perguntas:
                pergunta_dict = {
                    'ID': pergunta['ID'],
                    'pergunta': pergunta['Pergunta'],
                    'ID_Nivel': pergunta['ID_Nivel']
                }
                perguntas_implementacao.append(pergunta_dict)
            cursor.close()
            return perguntas_implementacao

        except Exception as e:
            print(f"Erro ao buscar perguntas de implementação: {e}")
            raise