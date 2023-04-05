const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const {readFile, writeFile} = require('fs').promises
const log = path.resolve(__dirname, '..', 'botLog.txt')
const atendimentosJSON = require(path.resolve(__dirname, '..', 'atendimentos.json'))

class Functions{
    constructor(){
        this.isOnline = false
    }
    connect_db(){
        let msg = ''
        const database = new sqlite3.Database(path.resolve(__dirname, 'database.db'), e => {
            if (e) {
                this.isOnline = false
                msg = 'Um erro ocorreu ao se conectar banco de dados\n'
                this.writeLog(msg, database)
                return console.log(msg);   
            }
        })
        this.isOnline = true
        msg = '\nConectado ao banco de dados com sucesso'
        this.writeLog(msg, database)
        console.log(msg);
        return database 
    }
    async hasClient(database, client, addClient){
        let msg = ''
        await database.get('SELECT * FROM clientes WHERE from_user=?', [client['from_user']], (err, rows) => {
            if(err){
                msg = 'Erro ao consultar cliente'
                this.writeLog(msg, database)
                console.log(msg, err);
                // this.closeDatabase(database)
                return false
            }
            msg = 'Verificando se há registro de: ' + client['from_user']
            this.writeLog(msg, database)
            console.log(msg);
            if(rows !== undefined){
                msg = `${client['from_user']} já está registrado no banco de dados`
                this.writeLog(msg, database)
                console.log(msg);
                // this.closeDatabase(database)
                return true
            }
            if(addClient)this.addClient(database, client)
            msg = `${client['from_user']} não registrado`
            this.writeLog(msg, database)
            console.log(msg);
            return false
        })
    }
    async addClient(database, client){
        let msg = ''
        msg = `Registrando: ${client['from_user']}`
        this.writeLog(msg, database)
        console.log(msg);
        if(client['pushname'] === undefined) client['pushname'] = null
        const client_data = Object.values(client)
        await database.run('INSERT INTO clientes(bot_watch, pushname, from_user, number, data_cadastro, hora_cadastro) VALUES(?, ?, ?, ?, ?, ?)', client_data, err => {
            if(err){
                // this.closeDatabase(database)
                msg = `Um erro ocorreu ao registrar: ${client}`
                this.writeLog(msg, database)
                return console.log(msg, err);
            }
            // this.closeDatabase(database)
            msg = `${client['from_user']} registrado com sucesso`
            this.writeLog(msg, database)
            return console.log(msg, this.lastID, this.changes);
        })
    }
    async regMessageUser(database, message){
        let msg = ''
        msg = `Registrando mensagem: ${message['msg_user']}`
        this.writeLog(msg, database)
        console.log(msg);
        const message_data = Object.values(message)
        await database.run('INSERT INTO mensagens(is_bot_msg, user_from, user_msg, user_msg_data, user_msg_hora) VALUES(?, ?, ?, ?, ?)', message_data, err => {
            if(err){
                // this.closeDatabase(database)
                msg = `Um erro ocorreu ao registrar messagem: ${message['msg_user']}`
                this.writeLog(msg, database)
                return console.log(msg, err);
            }
            // this.closeDatabase(database)
            msg = `Mensagem " ${message['msg_user']} " registrada com sucesso`
            this.writeLog(msg, database)
            return console.log(msg);
        })
    }
    async getResposta(database, msg, client, cliente){
        await database.serialize(() => {
            database.each('SELECT palavra_chave FROM atendimentos', [], (err, result) => {
                let resposta = `Olá, *${cliente.pushname}*! \n\n`
                if (err) throw err
                let atendimento = Object.values(result)[0]
                if(msg.msg_user.toLowerCase() === atendimento/*.includes(atendimento)*/){
                    database.get('SELECT * FROM atendimentos WHERE palavra_chave=?', [atendimento], (err, result) => {
                        if (err) throw err
                        let respostaBot = result.resposta_bot
                        resposta += `${respostaBot}`
                        msg.msg_user.toLowerCase().replace(atendimento, '')
                        this.sendResposta(msg.from_user, resposta, client)
                    })
                } 
            })
            .each('SELECT palavra_chave FROM respostas', [], (err, result) => {
                let resposta = ''
                if (err) throw err
                let respostaBot = Object.values(result)[0]
                if(msg.msg_user.toLowerCase().includes(respostaBot)){
                    database.get('SELECT * FROM respostas WHERE palavra_chave=?', [respostaBot], (err, result) => {
                        if (err) throw err
                        let res = result.resposta_bot
                        resposta += atendimentosJSON[`${res}`]
                        this.sendResposta(msg.from_user, resposta, client)
                    })
                }
            }) 
        })
    }
    async sendResposta(from, msg, client){
        await client.sendText(from, msg)
    }
    async closeDatabase(database){
        let msg = ''
        msg = 'Fechando conexão com o banco de dados'
        this.writeLog(msg, database)
        console.log(msg);
        await database.close()
    }
    async writeLog(data, database){
        let msg = ''
        await database.run('INSERT INTO botlog(logdata) VALUES(?)', data, err => {
            if(err){
                // this.closeDatabase(database)
                msg = `Um erro ocorreu ao gravar log`
                return console.log(msg, err);
            }
            // this.closeDatabase(database)
            msg = `Log gravado com sucesso`
            return console.log(msg);
        })
        // try{
        //     await writeFile(file, data)
        //     console.log('Log gravado com sucesso!');
        // }catch (e){
        //     console.log('Impossível gravar Log, ', e);
        // }
    }
}
module.exports = Functions