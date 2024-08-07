class Avaliacao:
    def __init__(self, db):
        self.db = db

    def adicionar_avaliacao(self, nome, descricao, id_nivel_solicitado, adjunto_emails, colaborador_emails):
        try:
            print(f"Adicionando avaliação com Nome: {nome}, Descricao: {descricao}, ID_Nivel_Solicitado: {id_nivel_solicitado}")
            query = """
                INSERT INTO avaliacao (Nome, Descricao, Status, ID_Empresa, ID_Nivel_Solicitado, ID_Avaliador_Lider, ID_Atividade) 
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            values = (nome, descricao, "Em andamento", 1, id_nivel_solicitado, 1, 1)
            self.db.execute_query(query, values)
            
            avaliacao_id = self.db.cursor.lastrowid

            for email in adjunto_emails:
                print(f"Inserindo email adjunto: {email}")
                query = "INSERT INTO usuario (Nome, Email, Senha, ID_Tipo) VALUES (%s, %s, %s, %s)"
                self.db.execute_query(query, ("Adjunto", email, "Senha Teste", 2), commit=False)

            for email in colaborador_emails:
                print(f"Inserindo email colaborador: {email}")
                query = "INSERT INTO usuario (Nome, Email, Senha, ID_Tipo) VALUES (%s, %s, %s, %s)"
                self.db.execute_query(query, ("Adjunto", email, "Senha Teste", 3), commit=False)

            self.db.conn.commit()
        except Exception as e:
            print(f"Erro ao adicionar avaliação: {e}")
            self.db.conn.rollback()
            raise

    def listar_avaliacoes(self):
        query = "SELECT * FROM avaliacao"
        print(f"Executando query: {query}")
        self.db.cursor.execute(query)
        result = self.db.cursor.fetchall()
        avaliacoes = []
        for row in result:
            avaliacao = {
                "id": row[0],
                "nome": row[1],
                "descricao": row[2],
                "id_avaliador_lider": row[3],
                "status": row[4],
                "id_atividade": row[5],
                "id_empresa": row[6],
                "id_nivel_solicitado": row[7]
            }
            avaliacoes.append(avaliacao)
        return avaliacoes
    
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
                "id_versao_modelo": row[10]
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