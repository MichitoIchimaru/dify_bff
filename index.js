const Koa = require("koa")
const { koaBody } = require("koa-body")
const serve = require('koa-static')
const cors = require('@koa/cors')
const log4js = require("log4js")
const routerV1 = require("./resources/v1")

// init
const app = new Koa()

// cors
app.use(cors())

// static 
app.use(serve('./public'))

// bodyparser
app.use(koaBody({
  jsonLimit: "10mb"
}))

// logger
log4js.configure({
  appenders: {
    console: { type: "console" },
    app: {
      type: "dateFile",
      pattern: "yyyy-MM-dd",
      filename: "logs/app.log"
    }
  },
  categories: {
    default: {
      appenders: ["console"],
      level: "info"
    }
  }
})
const logger = log4js.getLogger()
logger.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : "info"

app.use(async (ctx, next) => {
  await next()
  const rt = ctx.response.get("X-Response-Time")
  console.log(`${ctx.method} ${ctx.url} - ${rt}`)
})

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set("X-Response-Time", `${ms}ms`)
})

app.use(routerV1.routes())
app.use(routerV1.allowedMethods())

const port = process.env.DIFY_BFF_PORT ? parseInt(process.env.DIFY_BFF_PORT, 10) : 3000
app.listen(port)
logger.info("Server running on http://localhost:" + port)