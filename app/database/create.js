const sql = require('sqlite3').verbose()
const path = require('path')

class Create{
    constructor(){
        this.error_msg = null
        this.tb_clientes = false
        this.tb_mensagens = false
        this.tb_respostas = false
        this.tb_status = [
            this.tb_clientes,
            this.tb_mensagens,
            this.tb_respostas
        ]
    }
    init(){
        const db = new sql.Database(path.resolve(__dirname, 'database.db'), e => {
            if(e){
                return console.log('Um erro ocorreu ao se conectar banco de dados\n');
            }
            console.log('Conectado ao banco de dados com sucesso\n');
        })
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS clientes(
                id INTEGER NOT NULL PRIMARY KEY,
                bot_watch TEXT NOT NULL,
                pushname TEXT,
                from_user TEXT NOT NULL,
                number TEXT NOT NULL,
                data_cadastro TEXT NOT NULL,
                hora_cadastro TEXT NOT NULL
            );`, (e) => {
                if(e){
                    // this.tb_clientes = false
                    return console.log('Erro ao criar tabela CLIENTES\n', e);
                }
                // this.tb_clientes = true
                return console.log('Tabela CLIENTES criada com sucesso');
            })
            db.run(`CREATE TABLE IF NOT EXISTS mensagens(
                id INTEGER NOT NULL PRIMARY KEY,
                is_bot_msg TEXT NOT NULL,
                user_from TEXT NOT NULL,
                user_msg TEXT NOT NULL,
                user_msg_data TEXT NOT NULL,
                user_msg_hora TEXT NOT NULL
            );`, (e) => {
                if(e){
                    // this.tb_mensagens = false
                    return console.log('Erro ao criar tabela MENSAGENS\n', e);
                }
                // this.tb_mensagens = true
                return console.log('Tabela MENSAGENS criada com sucesso');
            })
            db.run(`CREATE TABLE IF NOT EXISTS respostas(
                id INTEGER NOT NULL PRIMARY KEY,
                palavra_chave TEXT NOT NULL,
                resposta_bot TEXT NOT NULL
            );`, (e) => {
                if(e){
                    // this.tb_respostas = false
                    return console.log('Erro ao criar tabela RESPOSTAS\n', e);
                }
                // this.tb_respostas = true
                return console.log('Tabela RESPOSTAS criada com sucesso');
            })
            db.run(`CREATE TABLE IF NOT EXISTS atendimentos(
                id INTEGER NOT NULL PRIMARY KEY,
                palavra_chave TEXT NOT NULL,
                resposta_bot TEXT NOT NULL
            );`, (e) => {
                if(e){
                    // this.atendimentos = false
                    return console.log('Erro ao criar tabela ATENDIMENTOS\n', e);
                }
                // this.atendimentos = true
                return console.log('Tabela ATENDIMENTOS criada com sucesso');
            })
            db.run(`CREATE TABLE IF NOT EXISTS botlog(
                id INTEGER NOT NULL PRIMARY KEY,
                logdata TEXT NOT NULL
            );`, (e) => {
                if(e){
                    // this.atendimentos = false
                    return console.log('Erro ao criar tabela BOTLOG\n', e);
                }
                // this.atendimentos = true
                return console.log('Tabela BOTLOG criada com sucesso');
            })
        })
        db.close((e) => {
            if(e){
                return console.log("Erro ao fechar banco de dados\n", e.message);
            }
        })
    }
    getStatus(){
        this.tb_status.forEach(el => {
            return console.log(el);
        })
    }
}

module.exports = Create