const venomBot = require('venom-bot')
const path = require('path')
const Functions = require(path.resolve(__dirname, 'database', 'Functions'))//('./database/Functions')
const funcs = new Functions()


module.exports = () => venomBot.create({
    session: this.session,
    folderNameToken: 'tokens',
    headless: false,
    devtools: false,
    useChrome: true,
    debug: false,
    logQR: true,
    browserArgs: [
        '--log-level=3',
        '--no-default-browser-check',
        '--disable-site-isolation-trials',
        '--no-experiments',
        '--ignore-gpu-blacklist',
        '--ignore-certificate-errors',
        '--ignore-certificate-errors-spki-list',
        '--disable-gpu',
        '--disable-extensions',
        '--disable-default-apps',
        '--enable-features=NetworkService',
        '--disable-setuid-sandbox',
        '--no-sandbox',
        // Extras
        '--disable-webgl',
        '--disable-threaded-animation',
        '--disable-threaded-scrolling',
        '--disable-in-process-stack-traces',
        '--disable-histogram-customizer',
        '--disable-gl-extensions',
        '--disable-composited-antialiasing',
        '--disable-canvas-aa',
        '--disable-3d-apis',
        '--disable-accelerated-2d-canvas',
        '--disable-accelerated-jpeg-decoding',
        '--disable-accelerated-mjpeg-decode',
        '--disable-app-list-dismiss-on-blur',
        '--disable-accelerated-video-decode',
    ],
    refreshQR: 15000,
    autoClose: 60000,
    disableSpins: true,
    disableWelcome: false,
    createPathFileToken: true,
    waitForLogin: true
}).then(client => {
    this.client = client
    process.on('SIGINT', () => {
        client.close();
    })
    client.onMessage(async (message) => {
        const database = funcs.connect_db()
        if(!message.isGouping && message.body){ //Mensagens contidas e Únicas
            let pushname = null
            try{
                pushname = message.sender.pushname
            }catch(e){
                pushname = null
            }
            // if(message.sender.pushname === undefined) message.sender.pushname
            const cliente = {
                bot_watch: true,
                pushname: pushname,
                from_user: message.from,
                number: message.from.replace('@c.us', ""),
                data_cadastro: getData(),
                hora_cadastro: getTime()
            }
            const msg = {
                is_bot_msg: false,
                from_user: message.from,
                msg_user: message.body,
                user_msg_data: getData(),
                user_msg_hora: getTime()
            }
            // await client.sendText(message.from, 'Teste de Atendimento com Robô')
            funcs.hasClient(database, cliente, true)
            funcs.regMessageUser(database, msg)
            //await client.sendText(msg['from_user'], 
            funcs.getResposta(database, msg, client)
            // funcs.closeDatabase(database)
        }
        if(message.isGouping){ //Mensagens de Grupo
            return console.log('Mensagem de Grupo Recebida')
        }
    })
    client.onIncomingCall(async (call) => {
        console.log(call);
        await client.sendText(call.peerJid, `${bot_title} Agradeço sua Chamada`);
    })
}).catch(e => {
    return e
})

function getData(){
    const data = new Date()
    let date = `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`
    return date
}
function getTime(){
    const data = new Date()
    let hora = `${data.getHours()}:${data.getMinutes()}:${data.getSeconds()}`
    return hora
}