const Router = require('@koa/router')
const router = new Router()
const log4js = require("log4js")

const logger = log4js.getLogger()
const difyUrl = process.env.DIFY_API_ENDPOINT + "/chat-messages"
const headers = {
  "Content-Type": "application/json",
  Authorization: "Bearer " + process.env.DIFY_API_KEY
}

// /chat-messages#POST
router.post("/chat-messages", async ctx => {
  logger.debug("===== /chat-messages#GET")
  logger.debug("request\n", JSON.stringify(ctx.request.body))

  const req = ctx.request.body
  const data = {
    user: "dummy",
    query: "",
    inputs: {},
    response_mode: "blocking",
    conversation_id: ""
  }

  logger.debug("headers:\n", ctx.request.headers)
  if (process.env.USER_KEY && ctx.request.headers[process.env.USER_KEY.toLowerCase()]) data.user = ctx.request.headers[process.env.USER_KEY.toLowerCase()]
  if (req["message_id"]) data["parent_message_id"] = req["message_id"]
  if (req["conversation_id"]) data["conversation_id"] = req["conversation_id"]
  if (req.query) data.query = req.query
  logger.debug("data\n", data)
  const stream = await fetch(difyUrl, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data)
  })

  const res = {}
  let responseText = ""
  for await (const chunk of stream.body) {
    const text = new TextDecoder("utf-8").decode(chunk)
    const json = JSON.parse(text)
    logger.debug(json)
    res.message_id = json["message_id"]
    res.conversation_id = json["conversation_id"]
    responseText += json.answer
  }
  res.answer = responseText
  ctx.body = res
})

module.exports = router