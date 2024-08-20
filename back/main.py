from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from Database import Database
from Nivel import Nivel
from Processo import Processo
from ResultadoEsperado import ResultadoEsperado
from Avaliacao import Avaliacao
from Projeto import Projeto
from Documento import Documento
from Versao_Modelo import Versao_Modelo
from Empresa import Empresa
from Instituicao import Instituicao
from Login import Login
from Cadastro import Cadastro
import os

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Conexão com o banco de dados MySQL
db_config = {
    "host": "127.0.0.1",
    "user": "root",
    "password": "root",
    "database": "checkfy"
}

# Criando objetos
db = Database(**db_config)
nivel = Nivel(db)
processo = Processo(db)
resultado_esperado = ResultadoEsperado(db)
avaliacao = Avaliacao(db)
projeto = Projeto(db)
documento = Documento(db)
versao_modelo = Versao_Modelo(db)
empresa = Empresa(db)
instituicao = Instituicao(db)
login = Login(db)
cadastro = Cadastro(db)

@app.route('/add_nivel', methods=['POST'])
def add_nivel():
    nivel_data = request.json
    try:
        nivel.add_nivel(nivel_data['nivel'], nivel_data['nome_nivel'], nivel_data['id_versao_modelo'])
        return jsonify({"message": "Nível adicionado com sucesso"}), 200
    except Exception as e:
        print(f"Erro ao adicionar nível: {e}")
        return jsonify({"message": "Erro ao adicionar nível", "error": str(e)}), 500

@app.route('/get_niveis/<int:id_versao_modelo>', methods=['GET'])
def get_niveis(id_versao_modelo):
    try:
        niveis = nivel.get_niveis(id_versao_modelo)
        return jsonify(niveis), 200
    except Exception as e:
        print(f"Erro ao buscar níveis: {e}")
        return jsonify({"message": "Erro ao buscar níveis", "error": str(e)}), 500

@app.route('/delete_nivel/<int:nivel_id>', methods=['DELETE'])
def delete_nivel(nivel_id):
    try:
        nivel.delete_nivel(nivel_id)
        return jsonify({"message": "Nível deletado com sucesso"}), 200
    except Exception as e:
        return jsonify({"message": "Erro ao deletar nível", "error": str(e)}), 500

@app.route('/update_nivel/<int:nivel_id>', methods=['PUT'])
def update_nivel(nivel_id):
    nivel_data = request.json
    try:
        nivel.update_nivel(nivel_id, nivel_data['nivel'], nivel_data['nome_nivel'])
        return jsonify({"message": "Nível atualizado com sucesso"}), 200
    except Exception as e:
        print(f"Erro ao atualizar nível: {e}")
        return jsonify({"message": "Erro ao atualizar nível", "error": str(e)}), 500

@app.route('/add_processo', methods=['POST'])
def add_processo():
    try:
        descricao = request.json['descricao']
        tipo = request.json['tipo']
        id_versao_modelo = request.json['id_versao_modelo']
        processo.add_processo(descricao, tipo, id_versao_modelo)
        return jsonify({"message": "Processo adicionado com sucesso"}), 200
    except Exception as e:
        print(f"Erro ao adicionar processo: {e}")
        return jsonify({"message": "Erro ao adicionar processo", "error": str(e)}), 500

@app.route('/get_processos/<int:id_versao_modelo>', methods=['GET'])
def get_processos(id_versao_modelo):
    try:
        processos = processo.get_processos(id_versao_modelo)
        return jsonify(processos), 200  
    except Exception as e:
        print(f"Erro ao buscar processos: {e}")
        return jsonify({"message": "Erro ao buscar processos", "error": str(e)}), 500

@app.route('/delete_processo/<int:processo_id>', methods=['DELETE'])
def delete_processo(processo_id):
    try:
        processo.delete_processo(processo_id)
        return jsonify({"message": "Processo deletado com sucesso"}), 200
    except Exception as e:
        return jsonify({"message": "Erro ao deletar processo", "error": str(e)}), 500

@app.route('/update_processo/<int:processo_id>', methods=['PUT'])
def update_processo(processo_id):
    try:
        data = request.json
        nova_descricao = data['nova_descricao']
        novo_tipo = data['novo_tipo']
        processo.update_processo(processo_id, nova_descricao, novo_tipo)
        return jsonify({"message": "Processo atualizado com sucesso"}), 200
    except Exception as e:
        print(f"Erro ao atualizar processo: {e}")
        return jsonify({"message": "Erro ao atualizar processo", "error": str(e)}), 500

@app.route('/add_resultado_esperado', methods=['POST'])
def add_resultado_esperado():
    try:
        data = request.json
        descricao = data['descricao']
        id_nivel_intervalo_inicio = data['id_nivel_intervalo_inicio']
        id_nivel_intervalo_fim = data['id_nivel_intervalo_fim']
        id_processo = data['id_processo']
        resultado_esperado.add_resultado_esperado(descricao, id_nivel_intervalo_inicio, id_nivel_intervalo_fim, id_processo)
        return jsonify({"message": "Resultado esperado adicionado com sucesso"}), 200
    except Exception as e:
        print(f"Erro ao adicionar resultado esperado: {e}")
        return jsonify({"message": "Erro ao adicionar resultado esperado", "error": str(e)}), 500

@app.route('/get_resultados_esperados', methods=['GET'])
def get_resultados_esperados_route():
    try:
        processos_ids = request.args.get('processosId')
        if not processos_ids:
            return jsonify({"message": "No process IDs provided"}), 400
        processos_ids_list = [int(id) for id in processos_ids.split(',')]
        resultado_esperado = ResultadoEsperado(db)
        resultados_esperados = resultado_esperado.get_resultados_esperados(processos_ids_list)
        return jsonify(resultados_esperados), 200
    except Exception as e:
        print(f"Erro ao buscar resultados esperados: {e}")
        return jsonify({"message": "Erro ao buscar resultados esperados", "error": str(e)}), 500


@app.route('/delete_resultado_esperado/<int:resultado_id>', methods=['DELETE'])
def delete_resultado_esperado(resultado_id):
    try:
        resultado_esperado.delete_resultado_esperado(resultado_id)
        return jsonify({"message": "Resultado esperado deletado com sucesso"}), 200
    except Exception as e:
        return jsonify({"message": "Erro ao deletar resultado esperado", "error": str(e)}), 500

@app.route('/update_resultado_esperado/<int:resultado_id>', methods=['PUT'])
def update_resultado_esperado(resultado_id):
    try:
        data = request.json
        nova_descricao = data['nova_descricao']
        novo_id_nivel_intervalo_inicio = data['novo_id_nivel_intervalo_inicio']
        novo_id_nivel_intervalo_fim = data['novo_id_nivel_intervalo_fim']
        novo_id_processo = data['novo_id_processo']
        resultado_esperado.update_resultado_esperado(resultado_id, nova_descricao, novo_id_nivel_intervalo_inicio, novo_id_nivel_intervalo_fim, novo_id_processo)
        return jsonify({"message": "Resultado esperado atualizado com sucesso"}), 200
    except Exception as e:
        print(f"Erro ao atualizar resultado esperado: {e}")
        return jsonify({"message": "Erro ao atualizar resultado esperado", "error": str(e)}), 500

@app.route('/add_avaliacao', methods=['POST'])
def add_avaliacao():
    avaliacao_data = request.json
    try:
        nome = avaliacao_data['companyName']
        descricao = avaliacao_data['descricao']
        nivel_solicitado = avaliacao_data['nivelSolicitado']
        adjunto_emails = avaliacao_data['adjuntoEmails']
        colaborador_emails = avaliacao_data['colaboradorEmails']
        id_versao_modelo = avaliacao_data['idVersaoModelo']
        id_usuario = avaliacao_data['idUsuario']
        avaliacao.adicionar_avaliacao(nome, descricao, nivel_solicitado, adjunto_emails, colaborador_emails, id_usuario, id_versao_modelo)
        return jsonify({"message": "Avaliação adicionada com sucesso"}), 200
    except KeyError as e:
        print(f"Erro: Campo necessário não fornecido - {str(e)}")
        return jsonify({"message": "Campo necessário não fornecido", "error": str(e)}), 400
    except Exception as e:
        print(f"Erro ao adicionar avaliação: {e}")
        return jsonify({"message": "Erro ao adicionar avaliação", "error": str(e)}), 500

@app.route('/listar_avaliacoes', methods=['GET'])
def listar_avaliacoes():
    try:
        projetos = avaliacao.listar_avaliacoes()
        return jsonify(projetos), 200
    except Exception as e:
        print(f"Erro ao listar projetos: {e}")
        return jsonify({"message": "Erro ao listar projetos", "error": str(e)}), 500

@app.route('/deletar_avaliacao/<int:projeto_id>', methods=['DELETE'])
def deletar_avaliacao(projeto_id):
    try:
        avaliacao.deletar_avaliacao(projeto_id)
        return jsonify({"message": "Avaliação deletada com sucesso"}), 200
    except Exception as e:
        return jsonify({"message": "Erro ao deletar avaliacão", "error": str(e)}), 500

@app.route('/atualizar_avaliacao/<int:projeto_id>', methods=['PUT'])
def atualizar_avaliacao(projeto_id):
    projeto_data = request.json
    try:
        avaliacao.atualizar_avaliacao(projeto_id, **projeto_data)
        return jsonify({"message": "Avaliação atualizada com sucesso"}), 200
    except Exception as e:
        print(f"Erro ao atualizar avaliação: {e}")
        return jsonify({"message": "Erro ao atualizar avaliação", "error": str(e)}), 500

@app.route('/atualizar_atividade/<int:projeto_id>', methods=['PUT'])
def atualizar_atividade(projeto_id):
    projeto_data = request.json
    try:
        nova_id_atividade = projeto_data.get('id_atividade')
        if nova_id_atividade is None:
            return jsonify({"message": "Campo 'id_atividade' ausente no JSON"}), 400
        
        avaliacao.atualizar_id_atividade(projeto_id, nova_id_atividade)
        return jsonify({"message": "ID_Atividade atualizada com sucesso"}), 200
    except Exception as e:
        print(f"Erro ao atualizar ID_Atividade: {e}")
        return jsonify({"message": "Erro ao atualizar ID_Atividade", "error": str(e)}), 500
    
@app.route('/inserir_planejamento/<int:projeto_id>', methods=['PUT'])
def inserir_planejamento(projeto_id):
    try:
        data = request.json
        avaliacao.inserir_planejamento(projeto_id, data['aprovacaoSoftex'], data['atividadePlanejamento'], data['cronogramaPlanejamento'])
        return jsonify({"message": "Planejamento adicionado com sucesso"}), 200
    except Exception as e:
        print(f"Erro ao atualizar ID_Atividade: {e}")
        return jsonify({"message": "Erro ao adicionar planejamento", "error": str(e)}), 500

@app.route('/avaliacao/<int:projeto_id>', methods=['GET'])
def obter_avaliacao(projeto_id):
    try:
        avaliacao_data = avaliacao.obter_avaliacao(projeto_id)
        if avaliacao_data:
            return jsonify(avaliacao_data), 200
        else:
            return jsonify({"message": "Avaliação não encontrada"}), 404
    except Exception as e:
        print(f"Erro ao obter avaliação: {e}")
        return jsonify({"message": "Erro ao obter avaliação", "error": str(e)}), 500

@app.route('/add_projeto', methods=['POST'])
def add_projeto():
    projeto_data = request.json
    try:
        avaliacao_id = projeto_data['avaliacaoId']
        nome_projeto = projeto_data['nome']
        habilitado = projeto_data['habilitado']
        numero_projeto = projeto.get_next_numero_projeto(avaliacao_id)
        projeto_id = projeto.add_projeto(avaliacao_id, nome_projeto, habilitado, numero_projeto)
        return jsonify({"message": "Projeto adicionado com sucesso", "projetoId": projeto_id}), 200
    except KeyError as e:
        print(f"Erro: Campo necessário não fornecido - {e}")
        return jsonify({"message": "Campo necessário não fornecido", "error": str(e)}), 400
    except Exception as e:
        print(f"Erro ao adicionar projeto: {e}")
        return jsonify({"message": "Erro ao adicionar projeto", "error": str(e)}), 500

@app.route('/update_projeto/<int:projeto_id>', methods=['PUT'])
def update_projeto(projeto_id):
    projeto_data = request.json
    try:
        nome_projeto = projeto_data['nome']
        habilitado = projeto_data['habilitado']
        projeto.update_projeto(projeto_id, nome_projeto, habilitado)
        return jsonify({"message": "Projeto atualizado com sucesso"}), 200
    except Exception as e:
        print(f"Erro ao atualizar projeto: {e}")
        return jsonify({"message": "Erro ao atualizar projeto", "error": str(e)}), 500

@app.route('/get_projetos_by_avaliacao/<int:avaliacao_id>', methods=['GET'])
def get_projetos_by_avaliacao(avaliacao_id):
    try:
        projetos = projeto.get_projetos_by_id_avaliacao(avaliacao_id)
        return jsonify(projetos), 200
    except Exception as e:
        print(f"Erro ao buscar projetos por ID de avaliação: {e}")
        return jsonify({"message": "Erro ao buscar projetos", "error": str(e)}), 500

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400
    if file:
        filename = file.filename
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        return jsonify({"filepath": filename}), 200 

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route('/add_documento', methods=['POST'])
def add_documento():
    documento_data = request.json
    try:
        id_projeto = documento_data['id_projeto']
        caminho_arquivo = documento_data['caminho_arquivo']
        nome_arquivo = documento_data['nome_arquivo']
        documento_id = documento.add_documento(caminho_arquivo, nome_arquivo, id_projeto)
        return jsonify({"message": "Documento adicionado com sucesso", "documentoId": documento_id}), 200
    except Exception as e:
        print(f"Erro ao adicionar documento: {e}")
        return jsonify({"message": "Erro ao adicionar documento", "error": str(e)}), 500

@app.route('/update_documento/<int:documento_id>', methods=['PUT'])
def update_documento(documento_id):
    documento_data = request.json
    try:
        nome_arquivo = documento_data.get('nome_arquivo')
        caminho_arquivo = documento_data.get('caminho_arquivo')
        documento.update_documento(documento_id, nome_arquivo, caminho_arquivo)
        return jsonify({"message": "Documento atualizado com sucesso"}), 200
    except Exception as e:
        print(f"Erro ao atualizar documento: {e}")
        return jsonify({"message": "Erro ao atualizar documento", "error": str(e)}), 500

@app.route('/documentos_por_projeto/<int:id_projeto>', methods=['GET'])
def documentos_por_projeto(id_projeto):
    try:
        documentos = documento.get_documentos_by_projeto(id_projeto)
        return jsonify(documentos), 200
    except Exception as e:
        print(f"Erro ao buscar documentos: {e}")
        return jsonify({"message": "Erro ao buscar documentos", "error": str(e)}), 500

@app.route('/delete_documento/<int:documento_id>', methods=['DELETE'])
def delete_documento(documento_id):
    try:
        documento.delete_documento(documento_id)
        return jsonify({"message": "Documento removido com sucesso"}), 200
    except Exception as e:
        print(f"Erro ao remover documento: {e}")
        return jsonify({"message": "Erro ao remover documento", "error": str(e)}), 500

@app.route('/get_processos_por_avaliacao/<int:avaliacao_id>/<int:id_versao_modelo>', methods=['GET'])
def get_processos_por_avaliacao(avaliacao_id, id_versao_modelo):
    try:
        nivel_solicitado_query = "SELECT ID_Nivel_Solicitado FROM avaliacao WHERE ID = %s"
        db.cursor.execute(nivel_solicitado_query, (avaliacao_id,))
        nivel_solicitado = db.cursor.fetchone()[0]

        processos_query = """
            SELECT DISTINCT p.ID, p.Descricao 
            FROM processo p
            JOIN resultado_esperado_mpsbr re ON p.ID = re.ID_Processo
            WHERE %s <= re.ID_Nivel_Intervalo_Inicio AND %s >= re.ID_Nivel_Intervalo_Fim and p.ID_Versao_Modelo = %s
        """
        db.cursor.execute(processos_query, (nivel_solicitado, nivel_solicitado, id_versao_modelo))
        processos = db.cursor.fetchall()

        return jsonify({
            'nivel_solicitado': nivel_solicitado,
            'processos': [{'ID': p[0], 'Descricao': p[1]} for p in processos]
        }), 200
    except Exception as e:
        print(f"Erro ao buscar processos por avaliação: {e}")
        return jsonify({"message": "Erro ao buscar processos", "error": str(e)}), 500

@app.route('/get_resultados_esperados_por_processo/<int:processo_id>/<int:avaliacao_id>', methods=['GET'])
def get_resultados_esperados_por_processo(processo_id, avaliacao_id):
    try:
        # Obtemos o nível solicitado da avaliação
        nivel_solicitado_query = "SELECT ID_Nivel_Solicitado FROM avaliacao WHERE ID = %s"
        db.cursor.execute(nivel_solicitado_query, (avaliacao_id,))
        nivel_solicitado = db.cursor.fetchone()[0]

        # Agora obtemos os resultados esperados que satisfazem a condição do nível solicitado
        query = """
            SELECT re.ID, re.Descricao, re.ID_Processo
            FROM resultado_esperado_mpsbr re
            WHERE re.ID_Processo = %s AND %s <= re.ID_Nivel_Intervalo_Inicio AND %s >= re.ID_Nivel_Intervalo_Fim
        """
        db.cursor.execute(query, (processo_id, nivel_solicitado, nivel_solicitado))
        resultados = db.cursor.fetchall()

        return jsonify([{
            'ID': r[0],
            'Descricao': r[1],
            'ID_Processo': r[2]
        } for r in resultados]), 200
    except Exception as e:
        print(f"Erro ao buscar resultados esperados por processo: {e}")
        return jsonify({"message": "Erro ao buscar resultados esperados", "error": str(e)}), 500

@app.route('/add_evidencia', methods=['POST'])
def add_evidencia():
    evidencia_data = request.json
    try:
        id_resultado_esperado = evidencia_data['id_resultado_esperado']
        id_documento = evidencia_data['id_documento']
        query = "INSERT INTO evidencia (ID_Resultado_Esperado, ID_Documento) VALUES (%s, %s)"
        db.cursor.execute(query, (id_resultado_esperado, id_documento))
        db.conn.commit()
        return jsonify({"message": "Evidencia adicionada com sucesso"}), 200
    except KeyError as e:
        print(f"Erro: Campo necessário não fornecido - {str(e)}")
        return jsonify({"message": f"Erro: Campo necessário não fornecido - {str(e)}"}), 400
    except Exception as e:
        print(f"Erro ao adicionar evidencia: {e}")
        db.conn.rollback()
        return jsonify({"message": "Erro ao adicionar evidencia", "error": str(e)}), 500

@app.route('/get_evidencias_por_resultado/<int:resultado_id>/<int:projeto_id>', methods=['GET'])
def get_evidencias_por_resultado(resultado_id, projeto_id):
    try:
        query = """
            SELECT d.ID, d.Caminho_Arquivo, d.Nome_Arquivo, d.ID_Projeto
            FROM documento d
            JOIN evidencia e ON d.ID = e.ID_Documento
            WHERE e.ID_Resultado_Esperado = %s AND d.ID_Projeto = %s
        """
        db.cursor.execute(query, (resultado_id, projeto_id))
        documentos = db.cursor.fetchall()
        return jsonify(documentos), 200
    except Exception as e:
        print(f"Erro ao buscar evidencias: {e}")
        return jsonify({"message": "Erro ao buscar evidencias", "error": str(e)}), 500

@app.route('/update_evidencia/<int:evidencia_id>', methods=['PUT'])
def update_evidencia(evidencia_id):
    evidencia_data = request.json
    try:
        id_resultado_esperado = evidencia_data['id_resultado_esperado']
        id_documento = evidencia_data['id_documento']
        projeto.update_evidencia(evidencia_id, id_resultado_esperado, id_documento)
        return jsonify({"message": "Evidencia atualizado com sucesso"}), 200
    except KeyError as e:
        print(f"Erro: Campo necessário não fornecido - {e}")
        return jsonify({"message": "Campo necessário não fornecido", "error": str(e)}), 400
    except Exception as e:
        print(f"Erro ao atualizar evidencia: {e}")
        return jsonify({"message": "Erro ao atualizar evidencia", "error": str(e)}), 500
    
@app.route('/delete_evidencia/<int:id_resultado_esperado>/<int:id_documento>', methods=['DELETE'])
def delete_evidencia(id_resultado_esperado, id_documento):
    try:
        query = "DELETE FROM evidencia WHERE ID_Resultado_Esperado = %s AND ID_Documento = %s"
        db.cursor.execute(query, (id_resultado_esperado, id_documento))
        db.conn.commit()
        return jsonify({"message": "Evidência deletada com sucesso"}), 200
    except Exception as e:
        print(f"Erro ao deletar evidência: {e}")
        return jsonify({"message": "Erro ao deletar evidência", "error": str(e)}), 500

@app.route('/add_or_update_grau_implementacao', methods=['POST'])
def add_or_update_grau_implementacao():
  try:
      data = request.json
      nota = data.get('nota')
      id_resultado_esperado = data.get('resultadoId')
      id_projeto = data.get('projetoId')

      # Verificar se já existe uma entrada para o resultado e projeto especificados
      query = """
          SELECT ID FROM grau_implementacao_processo_projeto 
          WHERE ID_Resultado_Esperado = %s AND ID_Projeto = %s
      """
      db.cursor.execute(query, (id_resultado_esperado, id_projeto))
      result = db.cursor.fetchone()

      if result:
          # Atualizar a entrada existente
          update_query = """
              UPDATE grau_implementacao_processo_projeto
              SET Nota = %s
              WHERE ID_Resultado_Esperado = %s AND ID_Projeto = %s
          """
          db.cursor.execute(update_query, (nota, id_resultado_esperado, id_projeto))
      else:
          # Inserir nova entrada
          insert_query = """
              INSERT INTO grau_implementacao_processo_projeto (Nota, ID_Resultado_Esperado, ID_Projeto)
              VALUES (%s, %s, %s)
          """
          db.cursor.execute(insert_query, (nota, id_resultado_esperado, id_projeto))

      db.conn.commit()
      return jsonify({"message": "Grau de implementação adicionado/atualizado com sucesso"}), 200
  except Exception as e:
      print(f"Erro ao adicionar/atualizar grau de implementação: {e}")
      db.conn.rollback()
      return jsonify({"message": "Erro ao adicionar/atualizar grau de implementação", "error": str(e)}), 500

@app.route('/get_graus_implementacao/<int:avaliacao_id>', methods=['GET'])
def get_graus_implementacao(avaliacao_id):
    try:
        query = """
            SELECT gip.ID, gip.Nota, gip.ID_Resultado_Esperado, gip.ID_Projeto
            FROM grau_implementacao_processo_projeto gip
            JOIN projeto p ON gip.ID_Projeto = p.ID
            WHERE p.ID_Avaliacao = %s
        """
        db.cursor.execute(query, (avaliacao_id,))
        graus = db.cursor.fetchall()
        graus_implementacao = [
            {'ID': g[0], 'Nota': g[1], 'ID_Resultado_Esperado': g[2], 'ID_Projeto': g[3]}
        for g in graus]

        return jsonify(graus_implementacao), 200
    except Exception as e:
        print(f"Erro ao buscar graus de implementação: {e}")
        return jsonify({"message": "Erro ao buscar graus de implementação", "error": str(e)}), 500

@app.route('/get_versao_modelo', methods=['GET'])
def get_versao_modelo():
    try:
        return jsonify(versao_modelo.get_versao_modelo()), 200  
    except Exception as e:
        print(f"Erro ao buscar versao_modelo: {e}")
        return jsonify({"message": "Erro ao buscar versao_modelo", "error": str(e)}), 500
    
@app.route('/add_versao_modelo', methods=['POST'])
def add_versao_modelo():
    try:
        data = request.json
        versao_modelo.add_versao_modelo(nome=data['nome'], status=data['status'])
        return jsonify({"message": "Processo adicionado com sucesso"}), 200
    except Exception as e:
        print(f"Erro ao adicionar processo: {e}")
        return jsonify({"message": "Erro ao adicionar processo", "error": str(e)}), 500


@app.route('/delete_versao_modelo/<int:versao_modelo_id>', methods=['DELETE'])
def delete_versao_modelo(versao_modelo_id):
    try:
        versao_modelo.delete_versao_modelo(versao_modelo_id)
        return jsonify({"message": "versao_modelo deletado com sucesso"}), 200
    except Exception as e:
        return jsonify({"message": "Erro ao deletar versao_modelo", "error": str(e)}), 500

@app.route('/update_versao_modelo/<int:versao_modelo_id>', methods=['PUT'])
def update_versao_modelo(versao_modelo_id):
    try:
        data = request.json
        versao_modelo_id.update_versao_modelo(nome=data['nome'], status=data['status'], id=versao_modelo_id)
        return jsonify({"message": "Processo atualizado com sucesso"}), 200
    except Exception as e:
        print(f"Erro ao atualizar processo: {e}")
        return jsonify({"message": "Erro ao atualizar processo", "error": str(e)}), 500

@app.route('/get_empresas', methods=['GET'])
def get_empresas():
    try:
        empresas = empresa.get_empresas()
        return jsonify(empresas)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/add_empresa', methods=['POST'])
def add_empresa():
    data = request.json
    try:
        empresa_id = empresa.add_empresa(data['nome'], data['cnpj'])
        return jsonify({'id': empresa_id, 'message': 'Empresa adicionada com sucesso!'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/update_empresa/<int:id>', methods=['PUT'])
def update_empresa(id):
    data = request.json
    try:
        empresa.update_empresa(id, data['nome'], data['cnpj'])
        return jsonify({'message': 'Empresa atualizada com sucesso!'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/delete_empresa/<int:id>', methods=['DELETE'])
def delete_empresa(id):
    try:
        empresa.delete_empresa(id)
        return jsonify({'message': 'Empresa deletada com sucesso!'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/empresa_avaliacao_insert/<int:avaliacao_id>', methods=['PUT'])
def empresa_avaliacao_insert(avaliacao_id):
    data = request.json
    try:
        empresa.empresa_avaliacao_insert(avaliacao_id, data['idEmpresa'])
        return jsonify({'message': 'Empresa atualizada com sucesso!'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/get_instituicoes', methods=['GET'])
def get_instituicoes():
    try:
        instituicoes = instituicao.get_instituicoes()
        return jsonify(instituicoes)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/add_instituicao', methods=['POST'])
def add_instituicao():
    data = request.json
    try:
        instituicao_id = instituicao.add_instituicao(data['nome'], data['cnpj'])
        return jsonify({'id': instituicao_id, 'message': 'Instituição adicionada com sucesso!'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/instituicao_avaliacao_insert/<int:avaliacao_id>', methods=['PUT'])
def instituicao_avaliacao_insert(avaliacao_id):
    data = request.json
    try:
        instituicao.instituicao_avaliacao_insert(avaliacao_id, data['idInstituicao'])
        return jsonify({'message': 'Instituição atualizada com sucesso!'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/login', methods=['POST'])
def user_login():
    data = request.json
    email = data.get('email')
    senha = data.get('senha')
    if not email or not senha:
        return jsonify({"message": "Email e senha são obrigatórios."}), 400

    response = login.login(email, senha)
    return jsonify(response), response.get("status", 200)

@app.route('/cadastro', methods=['POST'])
def cadastro_route():
    data = request.json
    print(f"Dados recebidos: {data}")
    
    nome = data.get('nome')
    email = data.get('email')
    senha = data.get('senha')
    cargo = data.get('cargo')

    response, status = cadastro.cadastrar_usuario(nome, email, senha, cargo)
    return jsonify(response), status




if __name__ == '__main__':
    app.run(debug=True)