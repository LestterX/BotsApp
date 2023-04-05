const sql = require('sqlite3').verbose()
const path = require('path')

class Create{
    constructor(){}
    init(){
        const db = new sql.Database(path.resolve(__dirname, 'database.db'), e => {
            if(e){
                return console.log('Um erro ocorreu ao se conectar banco de dados\n');
            }
            console.log('Conectado ao banco de dados com sucesso\n');
        })
        const dbLog = new sql.Database(path.resolve(__dirname, 'database-log.db'), err => {
            if(err) throw err
            console.log('Conectado ao log com sucesso');
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
                    return console.log('Erro ao criar tabela CLIENTES\n', e);
                }
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
                    return console.log('Erro ao criar tabela MENSAGENS\n', e);
                }
                return console.log('Tabela MENSAGENS criada com sucesso');
            })
            db.run(`CREATE TABLE IF NOT EXISTS respostas(
                id INTEGER NOT NULL PRIMARY KEY,
                palavra_chave TEXT NOT NULL,
                resposta_bot TEXT NOT NULL
            );`, (e) => {
                if(e){
                    return console.log('Erro ao criar tabela RESPOSTAS\n', e);
                }
                return console.log('Tabela RESPOSTAS criada com sucesso');
            })
            db.run(`CREATE TABLE IF NOT EXISTS atendimentos(
                id INTEGER NOT NULL PRIMARY KEY,
                palavra_chave TEXT NOT NULL,
                resposta_bot TEXT NOT NULL
            );`, (e) => {
                if(e){
                    return console.log('Erro ao criar tabela ATENDIMENTOS\n', e);
                }
                return console.log('Tabela ATENDIMENTOS criada com sucesso');
            })
            dbLog.run(`CREATE TABLE IF NOT EXISTS botlog(
                id INTEGER NOT NULL PRIMARY KEY,
                logdata TEXT NOT NULL
            );`, (e) => {
                if(e){
                    return console.log('Erro ao criar tabela BOTLOG\n', e);
                }
                return console.log('Tabela BOTLOG criada com sucesso');
            })
        })
        db.close((e) => {
            if(e){
                return console.log("Erro ao fechar banco de dados\n", e.message);
            }
        })
        dbLog.close((e) => {
            if(e){
                return console.log("Erro ao fechar log\n", e.message);
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