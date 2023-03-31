// import bot from './app/bot'
// import Create from './app/database/create'
const Create = require('./app/database/create')
const createdb = new Create().init()
const bot = require('./app/bot')()

// const start = new Promise((resolve, reject) => {
//     resolve(createdb.init())
// }).then((result) => {
//     console.log('bla' + result);
//     bot()
// }).catch(e => console.log(e))
