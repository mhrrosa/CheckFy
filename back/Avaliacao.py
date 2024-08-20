class Avaliacao:
    def __init__(self, db):
        self.db = db

    def adicionar_avaliacao(self, nome, descricao, id_nivel_solicitado, adjunto_emails, colaborador_emails, id_usuario, id_versao_modelo):
        try:
            query = """
                INSERT INTO avaliacao (Nome, Descricao, Status, ID_Nivel_Solicitado, ID_Avaliador_Lider, ID_Atividade, ID_Versao_Modelo) 
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            values = (nome, descricao, "Em andamento", id_nivel_solicitado, id_usuario, 1, id_versao_modelo)
            self.db.execute_query(query, values)
            id_avaliacao = self.db.cursor.lastrowid
            print(id_usuario, id_avaliacao)
            query = """
                INSERT INTO usuarios_avaliacao (ID_Avaliacao, ID_Usuario, ID_Funcao) 
                VALUES (%s, %s, %s)
            """
            values = (id_avaliacao, id_usuario, 1)
            self.db.execute_query(query, values)

            for email in adjunto_emails:
                query = "INSERT INTO usuario (Nome, Email, Senha, ID_Tipo) VALUES (%s, %s, %s, %s)"
                self.db.execute_query(query, ("Adjunto", email, "Senha Teste", 2), commit=False)

            for email in colaborador_emails:
                query = "INSERT INTO usuario (Nome, Email, Senha, ID_Tipo) VALUES (%s, %s, %s, %s)"
                self.db.execute_query(query, ("Adjunto", email, "Senha Teste", 3), commit=False)

            self.db.conn.commit()
        except Exception as e:
            print(f"Erro ao adicionar avaliação: {e}")
            self.db.conn.rollback()
            raise

    def listar_avaliacoes(self, idAvaliador):
        try:
            # Primeiro, buscar IDs de avaliação associados ao usuário
            print("Buscando IDs de avaliação para o usuário:", idAvaliador)
            query_ids = "SELECT ID_Avaliacao FROM usuarios_avaliacao WHERE ID_Usuario = %s"
            values = (idAvaliador,)
            self.db.cursor.execute(query_ids, values)
            avaliacao_ids = self.db.cursor.fetchall()
            print("IDs de avaliação encontrados:", avaliacao_ids)

            # Verificar se foram encontrados IDs de avaliação
            if not avaliacao_ids:
                print("Nenhum ID de avaliação encontrado.")
                return []

            # Extrair IDs de avaliação para uma lista simples
            avaliacao_ids = [row[0] for row in avaliacao_ids]

            # Agora, buscar as avaliações baseadas nos IDs encontrados
            placeholders = ','.join(['%s'] * len(avaliacao_ids))
            query = f"SELECT * FROM avaliacao WHERE ID IN ({placeholders})"
            print("Executando query para avaliações:", query)

            # Executar a query para buscar as avaliações
            self.db.cursor.execute(query, tuple(avaliacao_ids))
            result = self.db.cursor.fetchall()
            print("Avaliações encontradas:", result)

            # Transformar o resultado em uma lista de dicionários
            avaliacoes = [
                {
                    "id": row[0],
                    "nome": row[1],
                    "descricao": row[2],
                    "id_avaliador_lider": row[3],
                    "status": row[4],
                    "id_atividade": row[5],
                    "id_empresa": row[6],
                    "id_nivel_solicitado": row[7],
                    "id_versao_modelo": row[10],
                }
                for row in result
            ]

            return avaliacoes

        except Exception as e:
            print(f"Erro ao executar query: {e}")
            raise

    
    def obter_avaliacao(self, projeto_id):
        query = "SELECT * FROM avaliacao WHERE ID = %s"
        self.db.cursor.execute(query, (projeto_id,))
        row = self.db.cursor.fetchone()
        if row:
            avaliacao_data = {
                "id": row[0],
                "nome": row[1],
                "descricao": row[2],
                "id_avaliador_lider": row[3],
                "status": row[4],
                "id_atividade": row[5],
                "id_empresa": row[6],
                "id_nivel_solicitado": row[7],
                "id_versao_modelo": row[10],
                "id_instituicao": row[11],
                "atividade_planejamento": row[12],
                "cronograma_planejamento": row[13],
                "aprovacao_softex": row[14]
            }
            return avaliacao_data
        return None

    def deletar_avaliacao(self, projeto_id):
        query = "DELETE FROM avaliacao WHERE ID = %s"
        self.db.cursor.execute(query, (projeto_id,))
        self.db.conn.commit()

    def atualizar_avaliacao(self, projeto_id, novo_nome, nova_descricao, novo_id_avaliador_lider, novo_status, novo_modelo, novo_id_atividade, novo_id_empresa, novo_id_nivel_solicitado, novo_id_nivel_atribuido, novo_parece_nivel_final):
        query = "UPDATE avaliacao SET Nome = %s, Descricao = %s, ID_Avaliador_Lider = %s, Status = %s, Modelo = %s, ID_Atividade = %s, ID_Empresa = %s, ID_Nivel_Solicitado = %s, ID_Nivel_Atribuido = %s, Parece_Nivel_Final = %s WHERE ID = %s"
        values = (novo_nome, nova_descricao, novo_id_avaliador_lider, novo_status, novo_modelo, novo_id_atividade, novo_id_empresa, novo_id_nivel_solicitado, novo_id_nivel_atribuido, novo_parece_nivel_final, projeto_id)
        self.db.cursor.execute(query, values)
        self.db.conn.commit()

    def atualizar_id_atividade(self, projeto_id, nova_id_atividade):
        query = "UPDATE avaliacao SET ID_Atividade = %s WHERE ID = %s"
        values = (nova_id_atividade, projeto_id)
        self.db.cursor.execute(query, values)
        self.db.conn.commit()

    def inserir_planejamento(self, projeto_id, aprovacaoSoftex, atividade_planejamento, cronograma_planejamento):
        query = "UPDATE avaliacao SET Avaliacao_Aprovada_Pela_Softex = %s, Atividade_Planejamento = %s, Cronograma_Planejamento = %s WHERE ID = %s"
        values = (aprovacaoSoftex, atividade_planejamento, cronograma_planejamento, projeto_id)
        self.db.cursor.execute(query, values)
        self.db.conn.commit()