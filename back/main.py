from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from Database import Database
from Nivel import Nivel
from Processo import Processo
from ResultadoEsperado import ResultadoEsperado
from Avaliacao import Avaliacao
from Projeto import Projeto
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

@app.route('/add_nivel', methods=['POST'])
def add_nivel():
    nivel_data = request.json
    if 'nivel' not in nivel_data:
        return jsonify({"message": "Campo 'nivel' ausente no JSON"}), 400
    try:
        nivel.add_nivel(nivel_data['nivel'])
        return jsonify({"message": "Nível adicionado com sucesso"}), 200
    except Exception as e:
        print(f"Erro ao adicionar nível: {e}")
        return jsonify({"message": "Erro ao adicionar nível", "error": str(e)}), 500

@app.route('/get_all_niveis', methods=['GET'])
def get_all_niveis():
    try:
        niveis = nivel.get_all_niveis_ordered()
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
        nivel.update_nivel(nivel_id, nivel_data)
        return jsonify({"message": "Nível atualizado com sucesso"}), 200
    except Exception as e:
        print(f"Erro ao atualizar nível: {e}")
        return jsonify({"message": "Erro ao atualizar nível", "error": str(e)}), 500

@app.route('/add_processo', methods=['POST'])
def add_processo():
    try:
        descricao = request.json['descricao']
        tipo = request.json['tipo']
        processo.add_processo(descricao, tipo)
        return jsonify({"message": "Processo adicionado com sucesso"}), 200
    except Exception as e:
        print(f"Erro ao adicionar processo: {e}")
        return jsonify({"message": "Erro ao adicionar processo", "error": str(e)}), 500

@app.route('/get_all_processos', methods=['GET'])
def get_all_processos():
    try:
        processos = processo.get_all_processos()
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

@app.route('/get_all_resultados_esperados', methods=['GET'])
def get_all_resultados_esperados():
    try:
        resultados_esperados = resultado_esperado.get_all_resultados_esperados()
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
        
        # Lógica para adicionar a avaliação no banco de dados
        avaliacao.adicionar_avaliacao(nome, descricao, nivel_solicitado, adjunto_emails, colaborador_emails)
        
        return jsonify({"message": "Avaliação adicionada com sucesso"}), 200
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
        print(f"Recebido projeto_data: {projeto_data}")
        avaliacao_id = projeto_data['avaliacaoId']
        habilitado = projeto_data['habilitado']
        numero_projeto = projeto.get_next_numero_projeto(avaliacao_id)
        print(f"Calculado numero_projeto: {numero_projeto}")
        projeto_id = projeto.add_projeto(avaliacao_id, habilitado, numero_projeto)
        print(f"Projeto adicionado com ID: {projeto_id}")
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
        habilitado = projeto_data['habilitado']
        projeto.update_projeto(projeto_id, habilitado)
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
        print(f"Recebido documento_data: {documento_data}")
        id_projeto = documento_data['id_projeto']
        caminho_arquivo = documento_data['caminho_arquivo']
        nome_arquivo = documento_data['nome_arquivo']
        documento_id = projeto.add_documento(caminho_arquivo, nome_arquivo, id_projeto)
        print(f"Documento adicionado com ID: {documento_id}")
        return jsonify({"message": "Documento adicionado com sucesso", "documentoId": documento_id}), 200
    except Exception as e:
        print(f"Erro ao adicionar documento: {e}")
        return jsonify({"message": "Erro ao adicionar documento", "error": str(e)}), 500

@app.route('/documentos_por_projeto/<int:id_projeto>', methods=['GET'])
def documentos_por_projeto(id_projeto):
    try:
        documentos = projeto.get_documentos_by_projeto(id_projeto)
        return jsonify(documentos), 200
    except Exception as e:
        print(f"Erro ao buscar documentos: {e}")
        return jsonify({"message": "Erro ao buscar documentos", "error": str(e)}), 500

@app.route('/update_documento/<int:documento_id>', methods=['PUT'])
def update_documento(documento_id):
    documento_data = request.json
    try:
        nome_arquivo = documento_data['nome_arquivo']
        caminho_arquivo = documento_data['caminho_arquivo']
        query = "UPDATE documento SET Nome_Arquivo = %s, Caminho_Arquivo = %s WHERE ID = %s"
        db.cursor.execute(query, (nome_arquivo, caminho_arquivo, documento_id))
        db.conn.commit()
        print(f"Documento atualizado com ID: {documento_id}")
        return jsonify({"message": "Documento atualizado com sucesso"}), 200
    except Exception as e:
        print(f"Erro ao atualizar documento: {e}")
        return jsonify({"message": "Erro ao atualizar documento", "error": str(e)}), 500

@app.route('/delete_documento/<int:documento_id>', methods=['DELETE'])
def delete_documento(documento_id):
    try:
        query = "DELETE FROM documento WHERE ID = %s"
        db.cursor.execute(query, (documento_id,))
        db.conn.commit()
        print(f"Documento removido com ID: {documento_id}")
        return jsonify({"message": "Documento removido com sucesso"}), 200
    except Exception as e:
        print(f"Erro ao remover documento: {e}")
        return jsonify({"message": "Erro ao remover documento", "error": str(e)}), 500

@app.route('/add_indicador', methods=['POST'])
def add_indicador():
    indicador_data = request.json
    try:
        id_resultado_esperado = indicador_data['id_resultado_esperado']
        id_documento = indicador_data['id_documento']
        print(f"Adicionando indicador: id_resultado_esperado={id_resultado_esperado}, id_documento={id_documento}")
        projeto.add_indicador(id_resultado_esperado, id_documento)
        return jsonify({"message": "Indicador adicionado com sucesso"}), 200
    except KeyError as e:
        print(f"Erro: Campo necessário não fornecido - {str(e)}")
        return jsonify({"message": f"Erro: Campo necessário não fornecido - {str(e)}"}), 400
    except Exception as e:
        print(f"Erro ao adicionar indicador: {e}")
        return jsonify({"message": "Erro ao adicionar indicador", "error": str(e)}), 500

@app.route('/update_indicador/<int:indicador_id>', methods=['PUT'])
def update_indicador(indicador_id):
    indicador_data = request.json
    try:
        id_resultado_esperado = indicador_data['id_resultado_esperado']
        id_documento = indicador_data['id_documento']
        projeto.update_indicador(indicador_id, id_resultado_esperado, id_documento)
        return jsonify({"message": "Indicador atualizado com sucesso"}), 200
    except KeyError as e:
        print(f"Erro: Campo necessário não fornecido - {e}")
        return jsonify({"message": "Campo necessário não fornecido", "error": str(e)}), 400
    except Exception as e:
        print(f"Erro ao atualizar indicador: {e}")
        return jsonify({"message": "Erro ao atualizar indicador", "error": str(e)}), 500

@app.route('/get_processos_por_avaliacao/<int:avaliacao_id>', methods=['GET'])
def get_processos_por_avaliacao(avaliacao_id):
    try:
        nivel_solicitado_query = "SELECT ID_Nivel_Solicitado FROM avaliacao WHERE ID = %s"
        db.cursor.execute(nivel_solicitado_query, (avaliacao_id,))
        nivel_solicitado = db.cursor.fetchone()[0]

        processos_query = """
            SELECT DISTINCT p.ID, p.Descricao 
            FROM processo p
            JOIN resultado_esperado_mpsbr re ON p.ID = re.ID_Processo
            WHERE %s <= re.ID_Nivel_Intervalo_Inicio AND %s >= re.ID_Nivel_Intervalo_Fim
        """
        db.cursor.execute(processos_query, (nivel_solicitado, nivel_solicitado))
        processos = db.cursor.fetchall()

        print(f"Processos encontrados: {processos}")

        return jsonify({
            'nivel_solicitado': nivel_solicitado,
            'processos': [{'ID': p[0], 'Descricao': p[1]} for p in processos]
        }), 200
    except Exception as e:
        print(f"Erro ao buscar processos por avaliação: {e}")
        return jsonify({"message": "Erro ao buscar processos", "error": str(e)}), 500

@app.route('/get_resultados_esperados_por_processo/<int:processo_id>', methods=['GET'])
def get_resultados_esperados_por_processo(processo_id):
    try:
        query = """
            SELECT re.ID, re.Descricao, d.Nome_Arquivo, d.Caminho_Arquivo, re.ID_Processo
            FROM resultado_esperado_mpsbr re
            LEFT JOIN indicador i ON re.ID = i.ID_Resultado_Esperado
            LEFT JOIN documento d ON i.ID_Documento = d.ID
            WHERE re.ID_Processo = %s
        """
        db.cursor.execute(query, (processo_id,))
        resultados = db.cursor.fetchall()

        print(f"Resultados esperados para o processo {processo_id}: {resultados}")

        return jsonify([{
            'ID': r[0],
            'Descricao': r[1],
            'Nome_Arquivo': r[2],
            'Caminho_Arquivo': r[3],
            'ID_Processo': r[4]
        } for r in resultados]), 200
    except Exception as e:
        print(f"Erro ao buscar resultados esperados por processo: {e}")
        return jsonify({"message": "Erro ao buscar resultados esperados", "error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)