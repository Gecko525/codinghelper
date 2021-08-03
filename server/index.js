const Koa = require('koa')
const router = require('./router');
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')

const app = new Koa();

app.use(cors())
app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000)
console.log('server start at: http://localhost:3000')

module.exports = app;