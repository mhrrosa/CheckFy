const nodemailer = require('nodemailer');

class Email {
    constructor(db) {
        this.db = db;
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'checkfy123@gmail.com',
                pass: 'bsvsordretbmoatk' // Substitua com sua senha ou use variáveis de ambiente
            }
        });
    }

    async emailAprovarSoftex(idAvaliacao) {
        const query = `
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
            WHERE a.ID = ?
        `;

        try {
            const [row] = await this.db.fetchAll(query, [idAvaliacao]);

            if (row) {
                const { ID, Nome, Descricao, Status, Nome: nomeAvaliadorLider, Nome: nomeEmpresa, Nivel: nivelSolicitado, Nome: nomeVersaoModelo } = row;

                const mailOptions = {
                    from: 'checkfy123@gmail.com',
                    to: 'checkfy123@gmail.com',
                    subject: `Solicitação de Aprovação da Softex - Avaliação ID ${ID}`,
                    text: `
                    Prezado(a) Softex,

                    Gostaríamos de solicitar a sua aprovação para a seguinte avaliação, conforme os dados abaixo:

                    Nome da Avaliação: ${Nome}
                    Descrição: ${Descricao}
                    Avaliador Líder: ${nomeAvaliadorLider}
                    Status: ${Status}
                    Empresa: ${nomeEmpresa}
                    Nível Solicitado: ${nivelSolicitado}
                    Versão do Modelo: ${nomeVersaoModelo}

                    Por favor, verifique os dados e aprove para que possamos iniciar a avaliação.

                    Atenciosamente,
                    Equipe de Avaliação
                    `
                };

                await this.transporter.sendMail(mailOptions);
                console.log('E-mail enviado com sucesso!');
            } else {
                console.log('Avaliação não encontrada');
            }
        } catch (err) {
            console.error('Erro ao buscar avaliação no banco de dados:', err);
            throw err;
        }
    }

    async enviarEmailAuditorAvaliacaoInicial(idAvaliacao, emailAuditor) {
        const query = `
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
            WHERE a.ID = ?
        `;

        try {
            const [row] = await this.db.fetchAll(query, [idAvaliacao]);

            if (row) {
                const { ID, Nome, Descricao, Nome: nomeAvaliadorLider, Nome: nomeEmpresa, Nivel: nivelSolicitado } = row;

                const mailOptions = {
                    from: 'checkfy123@gmail.com',
                    to: emailAuditor,
                    subject: `Informações da Avaliação Inicial - ID ${ID}`,
                    text: `
                    Prezado(a) Auditor(a),

                    Você foi designado para realizar a auditoria da avaliação inicial. Seguem as informações da avaliação:

                    - ID da Avaliação: ${ID}
                    - Nome da Avaliação: ${Nome}
                    - Descrição: ${Descricao}
                    - Nome do Avaliador Líder: ${nomeAvaliadorLider}
                    - Nome da Empresa: ${nomeEmpresa}
                    - Nível Solicitado: ${nivelSolicitado}

                    Solicitamos que acesse o sistema para dar início ao processo de auditoria conforme as informações apresentadas. Caso tenha alguma dúvida ou necessite de informações adicionais, 
                    por favor, entre em contato com o avaliador líder.

                    Atenciosamente,
                    Equipe de Avaliação
                    `
                };

                await this.transporter.sendMail(mailOptions);
                console.log('E-mail enviado com sucesso!');
            } else {
                console.log('Avaliação não encontrada');
            }
        } catch (err) {
            console.error('Erro ao buscar avaliação no banco de dados:', err);
            throw err;
        }
    }
    async enviarEmailAuditorDataAvaliacaoFinal(idAvaliacao, emailAuditor) {
        const query = `
            SELECT a.ID, a.Nome, a.data_avaliacao_final, u.Nome
            FROM avaliacao a
            LEFT JOIN usuario u ON a.ID_Avaliador_Lider = u.ID
            WHERE a.ID = ?
        `;

        try {
            const [row] = await this.db.fetchAll(query, [idAvaliacao]);

            if (row) {
                const { ID, Nome, data_avaliacao_final, Nome: nomeAvaliadorLider } = row;

                // Convertendo e formatando a data para o formato dia/mês/ano
                let dataAvaliacaoFinalFormatada;
                try {
                    const dataObj = new Date(data_avaliacao_final);
                    dataAvaliacaoFinalFormatada = dataObj.toLocaleDateString('pt-BR');
                } catch (err) {
                    dataAvaliacaoFinalFormatada = data_avaliacao_final;
                }

                const mailOptions = {
                    from: 'checkfy123@gmail.com',
                    to: emailAuditor,
                    subject: `Data da Avaliação Final - ID ${ID}`,
                    text: `
                    Prezado(a) Auditor(a),

                    Informamos que a data da avaliação final para a avaliação ID ${ID} - ${Nome} foi agendada para ${dataAvaliacaoFinalFormatada}.

                    Avaliador Líder: ${nomeAvaliadorLider}

                    Caso tenha alguma dúvida, por favor, entre em contato com o avaliador líder.

                    Atenciosamente,

                    Equipe de Avaliação
                    `
                };

                await this.transporter.sendMail(mailOptions);
                console.log('E-mail enviado com sucesso!');
            } else {
                console.log('Avaliação não encontrada');
            }
        } catch (err) {
            console.error('Erro ao buscar avaliação no banco de dados:', err);
            throw err;
        }
    }

    async solicitarLinkFormularioFeedback(idAvaliacao) {
        const mailOptions = {
            from: 'checkfy123@gmail.com',
            to: 'checkfy123@gmail.com',
            subject: 'Solicitação de Link do Formulário de Feedback',
            text: `
            Prezado(a) Softex,

            Estamos entrando em contato para solicitar o link do formulário de feedback referente a avaliação ID: ${idAvaliacao}.

            Agradecemos pela atenção e aguardamos o envio do link.

            Atenciosamente,

            Equipe de Avaliação
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('E-mail de solicitação de link do formulário de feedback enviado com sucesso!');
        } catch (err) {
            console.error('Erro ao enviar e-mail:', err);
        }
    }
}

module.exports = Email;