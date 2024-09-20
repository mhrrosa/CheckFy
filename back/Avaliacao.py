class Avaliacao:
    def __init__(self, db):
        self.db = db

    def adicionar_avaliacao(self, nome, descricao, id_nivel_solicitado, adjunto_emails, colaborador_emails, id_usuario, id_versao_modelo):
        try:
            cursor = self.db.conn.cursor(dictionary=True)
            query = """
                INSERT INTO avaliacao (Nome, Descricao, Status, ID_Nivel_Solicitado, ID_Avaliador_Lider, ID_Atividade, ID_Versao_Modelo) 
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            values = (nome, descricao, "Em andamento", id_nivel_solicitado, id_usuario, 1, id_versao_modelo)
            cursor.execute(query, values)
            id_avaliacao = cursor.lastrowid

            # Inserir o criador da avaliação na tabela usuarios_avaliacao
            query = """
                INSERT INTO usuarios_avaliacao (ID_Avaliacao, ID_Usuario, ID_Funcao) 
                VALUES (%s, %s, %s)
            """
            values = (id_avaliacao, id_usuario, 1)
            cursor.execute(query, values)

            # Função auxiliar para inserir ou linkar usuário à avaliação
            def inserir_ou_linkar_usuario(email, id_funcao):
                # Verificar se o usuário já existe
                query = "SELECT ID FROM usuario WHERE Email = %s"
                cursor.execute(query, (email,))
                usuario = cursor.fetchone()
                
                # Consumir quaisquer resultados pendentes
                cursor.fetchall()

                if usuario:
                    # Usuário já existe, linkar à avaliação
                    query = "INSERT INTO usuarios_avaliacao (ID_Avaliacao, ID_Usuario, ID_Funcao) VALUES (%s, %s, %s)"
                    cursor.execute(query, (id_avaliacao, usuario[0], id_funcao))
                else:
                    # Usuário não existe, inserir e linkar à avaliação
                    query = "INSERT INTO usuario (Nome, Email, Senha, ID_Tipo) VALUES (%s, %s, %s, %s)"
                    cursor.execute(query, ("Usuário", email, "senha", id_funcao))
                    novo_usuario_id = self.db.cursor.lastrowid
                    # Linkar o novo usuário à avaliação
                    query = "INSERT INTO usuarios_avaliacao (ID_Avaliacao, ID_Usuario, ID_Funcao) VALUES (%s, %s, %s)"
                    cursor.execute(query, (id_avaliacao, novo_usuario_id, id_funcao))
                    # Simular envio de e-mail para cadastro
                    print(f"Simulação de envio de e-mail para {email} solicitando cadastro no sistema.")

            # Processar os e-mails dos avaliadores adjuntos
            for email in adjunto_emails:
                inserir_ou_linkar_usuario(email, 2)

            # Processar os e-mails dos colaboradores empresariais
            for email in colaborador_emails:
                inserir_ou_linkar_usuario(email, 5)

            self.db.conn.commit()
            cursor.close()
        except Exception as e:
            print(f"Erro ao adicionar avaliação: {e}")
            self.db.conn.rollback()
            cursor.close()
            raise


    def listar_avaliacoes(self, idAvaliador):
        try:
            cursor = self.db.conn.cursor(dictionary=True)
            query_ids = "SELECT ID_Avaliacao FROM usuarios_avaliacao WHERE ID_Usuario = %s"
            values = (idAvaliador,)
            cursor.execute(query_ids, values)
            avaliacao_ids = cursor.fetchall()

            if not avaliacao_ids:
                print("Nenhum ID de avaliação encontrada")
                cursor.close()
                return []

            avaliacao_ids = [row[0] for row in avaliacao_ids]

            placeholders = ','.join(['%s'] * len(avaliacao_ids))
            query = f"SELECT * FROM avaliacao WHERE ID IN ({placeholders})"

            # Executar a query para buscar as avaliações
            cursor.execute(query, tuple(avaliacao_ids))
            result = cursor.fetchall()

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
            cursor.close()
            return avaliacoes

        except Exception as e:
            print(f"Erro ao executar query: {e}")
            cursor.close()
            raise


    def obter_avaliacao(self, projeto_id):
        cursor = self.db.conn.cursor(dictionary=True)
        query = """
            SELECT 
                a.ID, 
                a.Nome, 
                a.Descricao, 
                a.ID_Avaliador_Lider, 
                u.Nome, 
                a.`Status`, 
                atv.Descricao, 
                a.ID_Empresa, 
                e.Nome, 
                n.Nivel as Nivel_Solicitado, 
                v.Nome, 
                a.ID_Instituicao, 
                a.Atividade_Planejamento, 
                a.Cronograma_Planejamento, 
                a.Avaliacao_Aprovada_Pela_Softex,
                a.ID_Atividade, 
                a.ID_Nivel_Solicitado, 
                a.ID_Versao_Modelo,
                r.descricao as descricao_relatorio, 
                r.Caminho_Arquivo as caminho_arquivo_relatorio, 
                tr.descricao as tipo_relatorio, 
                a.Ata_Reuniao_Abertura, 
                a.ID_Nivel_Atribuido, 
                n2.Nivel as Nivel_Atribuido, 
                a.Parecer_Final
            FROM avaliacao a
            LEFT JOIN empresa e ON a.ID_Empresa = e.ID
            LEFT JOIN nivel_maturidade_mpsbr n ON a.ID_Nivel_Solicitado = n.ID
            LEFT JOIN nivel_maturidade_mpsbr n2 ON a.ID_Nivel_Atribuido = n2.ID
            LEFT JOIN usuario u ON a.ID_Avaliador_Lider = u.ID
            LEFT JOIN versao_modelo v ON a.ID_Versao_Modelo = v.ID
            LEFT JOIN atividade atv ON a.ID_Atividade = atv.ID
            LEFT JOIN relatorio r ON a.ID = r.ID_Avaliacao
            LEFT JOIN tipo_relatorio tr ON r.ID_Tipo = tr.ID
            WHERE a.ID = %s
        """

        cursor.execute(query, (projeto_id,))
        row = cursor.fetchone()

        if row:
            avaliacao_data = {
                "id": row[0],  # ID da Avaliação
                "nome": row[1],  # Nome da Avaliação
                "descricao": row[2],  # Descrição da Avaliação
                "id_avaliador_lider": row[3],  # ID do Avaliador Líder
                "nome_avaliador_lider": row[4],  # Nome do Avaliador Líder
                "status": row[5],  # Status
                "descricao_atividade": row[6],  # Descrição da Atividade
                "id_empresa": row[7],  # ID da Empresa
                "nome_empresa": row[8],  # Nome da Empresa
                "nivel_solicitado": row[9],  # Nível Solicitado (Nome)
                "nome_versao_modelo": row[10],  # Nome da Versão do Modelo
                "id_instituicao": row[11],  # ID da Instituição
                "atividade_planejamento": row[12],  # Atividade Planejamento
                "cronograma_planejamento": row[13],  # Cronograma Planejamento
                "aprovacao_softex": row[14],  # Aprovação Softex
                "id_atividade": row[15],  # ID da Atividade
                "id_nivel_solicitado": row[16],  # ID do Nível Solicitado
                "id_versao_modelo": row[17],  # ID da Versão do Modelo
                "descricao_relatorio_ajuste_inicial": row[18],  # Descrição do Relatório
                "caminho_arquivo_relatorio_ajuste_inicial": row[19],  # Caminho do Arquivo do Relatório
                "tipo_relatorio_ajuste_inicial": row[20],  # Tipo de Relatório
                "ata_reuniao_abertura": row[21],  # Ata de Reunião de Abertura
                "id_nivel_atribuido": row[22], # Id do nivel atribuido
                "nivel_atribuido": row[23], # Nome do nivel atribuido
                "parecer_final": row[24], # Parecer final
            }
            cursor.close()
            return avaliacao_data
        else:
            print(f"Erro: A consulta não retornou os campos esperados. Resultado da consulta: {row}")
            cursor.close()
        return None


    def deletar_avaliacao(self, projeto_id):
        cursor = self.db.conn.cursor(dictionary=True)
        query = "DELETE FROM avaliacao WHERE ID = %s"
        cursor.execute(query, (projeto_id,))
        cursor.close()

    def atualizar_avaliacao(self, projeto_id, novo_nome, nova_descricao, novo_id_avaliador_lider, novo_status, novo_modelo, novo_id_atividade, novo_id_empresa, novo_id_nivel_solicitado, novo_id_nivel_atribuido, novo_parece_nivel_final):
        cursor = self.db.conn.cursor(dictionary=True)
        query = "UPDATE avaliacao SET Nome = %s, Descricao = %s, ID_Avaliador_Lider = %s, Status = %s, Modelo = %s, ID_Atividade = %s, ID_Empresa = %s, ID_Nivel_Solicitado = %s, ID_Nivel_Atribuido = %s, Parece_Nivel_Final = %s WHERE ID = %s"
        values = (novo_nome, nova_descricao, novo_id_avaliador_lider, novo_status, novo_modelo, novo_id_atividade, novo_id_empresa, novo_id_nivel_solicitado, novo_id_nivel_atribuido, novo_parece_nivel_final, projeto_id)
        cursor.execute(query, values)
        cursor.close()

    def atualizar_id_atividade(self, projeto_id, nova_id_atividade):
        cursor = self.db.conn.cursor(dictionary=True)
        query = "UPDATE avaliacao SET ID_Atividade = %s WHERE ID = %s"
        values = (nova_id_atividade, projeto_id)
        cursor.execute(query, values)
        cursor.close()

    def inserir_planejamento(self, projeto_id, aprovacaoSoftex, atividade_planejamento, cronograma_planejamento):
        cursor = self.db.conn.cursor(dictionary=True)
        query = "UPDATE avaliacao SET Avaliacao_Aprovada_Pela_Softex = %s, Atividade_Planejamento = %s, Cronograma_Planejamento = %s WHERE ID = %s"
        values = (aprovacaoSoftex, atividade_planejamento, cronograma_planejamento, projeto_id)
        cursor.execute(query, values)
        cursor.close()
    
    def inserir_ata_reuniao(self, projeto_id, ata_reuniao):
        cursor = self.db.conn.cursor(dictionary=True)
        query = "UPDATE avaliacao SET Ata_Reuniao_Abertura = %s WHERE ID = %s"
        values = (ata_reuniao, projeto_id)
        cursor.execute(query, values)
        cursor.close()

    def salvar_apresentacao_equipe(self, id_avaliacao, apresentacao_inicial, equipe_treinada):
        cursor = self.db.conn.cursor(dictionary=True)
        try:
            query = """
                UPDATE avaliacao 
                SET Apresentacao_Inicial = %s, Equipe_Treinada = %s
                WHERE ID = %s
            """
            values = (apresentacao_inicial, equipe_treinada, id_avaliacao)
            cursor.execute(query, values)
            cursor.close()
        except Exception as e:
            print(f"Erro ao salvar apresentação inicial e equipe treinada: {e}")
            cursor.close()
            raise

    def get_apresentacao_equipe(self, id_avaliacao):
        cursor = self.db.conn.cursor(dictionary=True)
        try:
            query = """
                SELECT Apresentacao_Inicial, Equipe_Treinada
                FROM avaliacao
                WHERE ID = %s
            """
            cursor.execute(query, (id_avaliacao,))
            result = cursor.fetchone()

            if result:
                cursor.close()
                return {
                    "apresentacao_inicial": bool(result[0]),
                    "equipe_treinada": bool(result[1])
                }
            else:
                cursor.close()
                return None
        except Exception as e:
            print(f"Erro ao buscar apresentação inicial e equipe treinada: {e}")
            cursor.close()
            raise


    def atualizar_avaliacao_ajuste_inicial(self, avaliacao_id, descricao, cronograma_planejamento, atividade_planejamento):
        cursor = self.db.conn.cursor(dictionary=True)
        try:
            query = "UPDATE avaliacao SET Descricao = %s, Cronograma_Planejamento = %s, Atividade_Planejamento = %s WHERE ID = %s"
            values = (descricao, cronograma_planejamento, atividade_planejamento, avaliacao_id)
            cursor.execute(query, values)
            cursor.close()
        except Exception as e:
            print(f"Erro ao atualizar empresa no banco de dados: {e}")
            cursor.close()
            raise e
    
    def adicionar_data_avaliacao_final(self, id_avaliacao, data_avaliacao_final):
        cursor = self.db.conn.cursor(dictionary=True)
        try:
            query = "UPDATE avaliacao SET data_avaliacao_final = %s WHERE ID = %s"
            cursor.execute(query, (data_avaliacao_final, id_avaliacao))
            cursor.close()
        except Exception as e:
            print(f"Erro ao adicionar data da avaliação final: {e}")
            self.db.conn.rollback()
            cursor.close()
            raise

    def obter_data_avaliacao_final(self, id_avaliacao):
        cursor = self.db.conn.cursor(dictionary=True)
        try:
            query = "SELECT data_avaliacao_final FROM avaliacao WHERE ID = %s"
            cursor.execute(query, (id_avaliacao,))
            data_avaliacao_final = cursor.fetchone()
            cursor.close()
            return data_avaliacao_final[0] if data_avaliacao_final else None
        except Exception as e:
            print(f"Erro ao obter data da avaliação final: {e}")
            cursor.close()
            raise

    def atualizar_data_avaliacao_final(self, id_avaliacao, nova_data_avaliacao_final):
        cursor = self.db.conn.cursor(dictionary=True)
        try:
            query = "UPDATE avaliacao SET data_avaliacao_final = %s WHERE ID = %s"
            cursor.execute(query, (nova_data_avaliacao_final, id_avaliacao))
            cursor.close()
        except Exception as e:
            print(f"Erro ao atualizar data da avaliação final: {e}")
            cursor.close()
            raise

    def update_resultado_final(self, id_avaliacao, parecer_final, id_nivel_atribuido):
        cursor = self.db.conn.cursor(dictionary=True)
        query = "UPDATE avaliacao SET Parecer_Final = %s, ID_Nivel_Atribuido = %s WHERE ID = %s"
        values = ( parecer_final, id_nivel_atribuido, id_avaliacao)
        cursor.execute(query, values)
        cursor.close()