const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const db = new sqlite3.Database(path.resolve(__dirname, 'database.db'), (err) => {
    if(err) throw err
    console.log('Conectado com sucesso');
})

function list(db){
    const msg = {
        is_bot_msg: false,
        from_user: 'message.from',
        msg_user: 'oi',
        user_msg_data: 'getData()',
        user_msg_hora: 'getTime()'
    }
    let msge = 'Não funciona'
    db.get('SELECT * FROM atendimentos WHERE palavra_chave=?', msg.msg_user, (err, result) => {
        if (err) throw err
        console.log(result['resposta_bot']);
    })
    return msge
}

console.log(list(db))



function closedb(){
    db.close(err => {
        if(err) throw err
        console.log('Desconectado com sucesso');
    })
}
closedb()