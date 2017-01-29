'use strict'

const serve = require('koa-static')
const koa = require('koa')
const app = koa()

const port = 5999

app.use(serve(__dirname+'/public/'))

app.listen(port)

console.log('app listening '+port)
