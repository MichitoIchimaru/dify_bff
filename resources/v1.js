const Router = require('@koa/router')
const router = new Router({
  prefix: "/api/v1"
})
const dify = require("./v1/dify")

router.use(dify.routes())
router.use(dify.allowedMethods)

module.exports = router