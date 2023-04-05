const Create = require('./app/database/create')
const createdb = new Create().init()
const bot = require('./app/bot')()