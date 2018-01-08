/// <reference types='node' />
import * as Koa from 'koa'
import { router } from './lib'
import { Context } from "koa"
import { baseMid } from './middleware/base';
import { authMid } from './middleware/auth';
// import * as koaBody from 'koa-body'

let app: Koa = new Koa()

// app.use(bodyParser.json())
// app.use(bodyParser.raw())
app.use(baseMid)
app.use(authMid)

app.on('error', (err, ctx:Context) => {
    console.error('server error', err)
    console.log(ctx.body)
    console.log(ctx.status)
})
app.silent = true

// app.use(koaBody())
app.use(router.init().middleware())


app.listen(50000)
console.log('ready for server')