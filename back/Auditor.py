class Auditor:
    def __init__(self, db):
        self.db = db

    def adicionar_auditor(self, id_avaliacao, auditor_emails):
        try:
            def inserir_ou_linkar_usuario(email, id_funcao):
                query = "SELECT ID FROM usuario WHERE Email = %s"
                self.db.cursor.execute(query, (email,))
                usuario = self.db.cursor.fetchone()
                self.db.cursor.fetchall()

                if usuario:
                    query = "INSERT INTO usuarios_avaliacao (ID_Avaliacao, ID_Usuario, ID_Funcao) VALUES (%s, %s, %s)"
                    self.db.execute_query(query, (id_avaliacao, usuario[0], id_funcao))
                else:
                    query = "INSERT INTO usuario (Nome, Email, Senha, ID_Tipo) VALUES (%s, %s, %s, %s)"
                    self.db.execute_query(query, ("Usuário", email, "senha", id_funcao))
                    novo_usuario_id = self.db.cursor.lastrowid
                    query = "INSERT INTO usuarios_avaliacao (ID_Avaliacao, ID_Usuario, ID_Funcao) VALUES (%s, %s, %s)"
                    self.db.execute_query(query, (id_avaliacao, novo_usuario_id, id_funcao))
                    print(f"Simulação de envio de e-mail para {email} solicitando cadastro no sistema.")

            for email in auditor_emails:
                inserir_ou_linkar_usuario(email, 3)

            self.db.conn.commit()

        except Exception as e:
            print(f"Erro ao adicionar auditores: {e}")
            self.db.conn.rollback()
            raise

    def get_email_auditor(self, id_avaliacao):
        try:
            query = """
                SELECT ID_Usuario FROM usuarios_avaliacao
                WHERE ID_Avaliacao = %s AND ID_Funcao = 3
            """
            self.db.cursor.execute(query, (id_avaliacao,))
            result = self.db.cursor.fetchone()
            self.db.cursor.fetchall()  # Garantir que todos os resultados foram consumidos

            if result:
                id_usuario = result[0]
                query = "SELECT Email FROM usuario WHERE ID = %s"
                self.db.cursor.execute(query, (id_usuario,))
                usuario = self.db.cursor.fetchone()
                self.db.cursor.fetchall()  # Garantir que todos os resultados foram consumidos
                if usuario:
                    return usuario[0]
            return None

        except Exception as e:
            print(f"Erro ao buscar e-mail do auditor: {e}")
            raise