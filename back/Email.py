
'''
        S: ajmCheckfy_0
        bsvs ordr etbm oatk
'''
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class Email:
    def __init__(self, db):
        self.db = db

    def email_aprovar_softex(self, id_avaliacao):
        query = """
            SELECT a.ID, a.Nome, a.Descricao, a.ID_Avaliador_Lider, u.Nome, 
                   a.Status, atv.Descricao, a.ID_Empresa, e.Nome, n.Nivel, 
                   v.Nome, a.ID_Instituicao, a.Atividade_Planejamento, 
                   a.Cronograma_Planejamento, a.Avaliacao_Aprovada_Pela_Softex,
                   a.ID_Atividade, a.ID_Nivel_Solicitado, a.ID_Versao_Modelo
            FROM avaliacao a
            LEFT JOIN empresa e ON a.ID_Empresa = e.ID
            LEFT JOIN nivel_maturidade_mpsbr n ON a.ID_Nivel_Solicitado = n.ID
            LEFT JOIN usuario u ON a.ID_Avaliador_Lider = u.ID
            LEFT JOIN versao_modelo v ON a.ID_Versao_Modelo = v.ID
            LEFT JOIN atividade atv ON a.ID_Atividade = atv.ID
            WHERE a.ID = %s
        """

        try:
            self.db.cursor.execute(query, (id_avaliacao,))
            row = self.db.cursor.fetchone()

            if row:
                # Extraindo dados da avaliação
                id = row[0]
                nome = row[1]
                descricao = row[2]
                nome_avaliador_lider = row[4]
                status = row[5]
                descricao_atividade = row[6]
                nome_empresa = row[8]
                nivel_solicitado = row[9]
                nome_versao_modelo = row[10]

                # Configurando o e-mail
                remetente = "checkfy123@gmail.com"
                destinatario = "checkfy123@gmail.com"
                assunto = "Solicitação de Aprovação da Softex - Avaliação ID {}".format(id)
                
                corpo = f"""
                Prezado(a) Softex,

                Gostaríamos de solicitar a sua aprovação para a seguinte avaliação, conforme os dados abaixo:

                Nome da Avaliação: {nome}
                Descrição: {descricao}
                Avaliador Líder: {nome_avaliador_lider}
                Status: {status}
                Empresa: {nome_empresa}
                Nível Solicitado: {nivel_solicitado}
                Versão do Modelo: {nome_versao_modelo}

                Por favor, verifique os dados e aprove para que possamos iniciar a avaliação.

                Atenciosamente,
                Equipe de Avaliação
                """

                # Criando a mensagem de e-mail
                mensagem = MIMEMultipart()
                mensagem['From'] = remetente
                mensagem['To'] = destinatario
                mensagem['Subject'] = assunto
                mensagem.attach(MIMEText(corpo, 'plain'))

                # Enviando o e-mail via servidor SMTP do Gmail
                try:
                    with smtplib.SMTP('smtp.gmail.com', 587) as server:
                        server.starttls()
                        server.login(remetente, "bsvsordretbmoatk")
                        server.send_message(mensagem)
                    print("E-mail enviado com sucesso!")
                except Exception as e:
                    print(f"Erro ao enviar e-mail: {e}")
            else:
                print('Avaliação não encontrada')
        except Exception as e:
            print(f"Erro ao buscar avaliação no banco de dados: {e}")
            raise e
    

    def enviar_email_auditor_avaliacao_inicial(self, id_avaliacao, email_auditor):
        query = """
                    SELECT a.ID, a.Nome, a.Descricao, a.ID_Avaliador_Lider, u.Nome, 
                        a.Status, atv.Descricao, a.ID_Empresa, e.Nome, n.Nivel, 
                        v.Nome, a.ID_Instituicao, a.Atividade_Planejamento, 
                        a.Cronograma_Planejamento, a.Avaliacao_Aprovada_Pela_Softex,
                        a.ID_Atividade, a.ID_Nivel_Solicitado, a.ID_Versao_Modelo,
                        r.descricao as descricao_relatorio, tr.descricao as tipo_relatorio
                    FROM avaliacao a
                    LEFT JOIN empresa e ON a.ID_Empresa = e.ID
                    LEFT JOIN nivel_maturidade_mpsbr n ON a.ID_Nivel_Solicitado = n.ID
                    LEFT JOIN usuario u ON a.ID_Avaliador_Lider = u.ID
                    LEFT JOIN versao_modelo v ON a.ID_Versao_Modelo = v.ID
                    LEFT JOIN atividade atv ON a.ID_Atividade = atv.ID
                    LEFT JOIN relatorio r ON a.ID = r.ID_Avaliacao
                    LEFT JOIN tipo_relatorio tr ON r.ID_Tipo = tr.ID
                    WHERE a.ID = %s
                """

        try:
            self.db.cursor.execute(query, (id_avaliacao,))
            row = self.db.cursor.fetchone()

            if row:
                # Extraindo dados da avaliação
                id = row[0]
                nome = row[1]
                descricao = row[2]
                nome_avaliador_lider = row[4]
                nome_empresa = row[8]
                nivel_solicitado = row[9]
                descricao_relatorio = row[17]
                tipo_relatorio = row[18]

                # Configurando o e-mail
                remetente = "checkfy123@gmail.com"
                destinatario = email_auditor
                assunto = f"Informações da Avaliação Inicial - ID {id}"

                
                corpo = f"""
                Prezado(a) Auditor(a),

                Você foi designado para realizar a auditoria da avaliação inicial. Seguem as informações da avaliação:

                - ID da Avaliação: {id}
                - Nome da Avaliação: {nome}
                - Descrição: {descricao}
                - Nome do Avaliador Líder: {nome_avaliador_lider}
                - Nome da Empresa: {nome_empresa}
                - Nível Solicitado: {nivel_solicitado}

                Solicitamos que acesse o sistema para dar início ao processo de auditoria conforme as informações apresentadas. Caso tenha alguma dúvida ou necessite de informações adicionais, 
                por favor, entre em contato com o avaliador líder.

                Atenciosamente,

                Equipe de Avaliação
                """

                # Criando a mensagem de e-mail
                mensagem = MIMEMultipart()
                mensagem['From'] = remetente
                mensagem['To'] = destinatario
                mensagem['Subject'] = assunto
                mensagem.attach(MIMEText(corpo, 'plain'))

                # Enviando o e-mail via servidor SMTP do Gmail
                try:
                    with smtplib.SMTP('smtp.gmail.com', 587) as server:
                        server.starttls()
                        server.login(remetente, "bsvsordretbmoatk")
                        server.send_message(mensagem)
                    print("E-mail enviado com sucesso!")
                except Exception as e:
                    print(f"Erro ao enviar e-mail: {e}")
            else:
                print('Avaliação não encontrada')
        except Exception as e:
            print(f"Erro ao buscar avaliação no banco de dados: {e}")
            raise e
