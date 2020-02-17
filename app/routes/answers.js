const Router = require('koa-router')
// const jsonwebtoken = require('jsonwebtoken')
const jwt = require('koa-jwt')
// koa-jwt内置了jsonwentoken
const router = new Router({ prefix: '/questions/:questionId/answers' })
const { secret } = require('../config')
const {
  find,
  findById,
  create,
  update,
  delete: del,
  checkAnswerExist,
  checkAnswerer
} = require('../controllers/answers')
const auth = jwt({ secret })

router.get('/', find) //获取话题列表
router.post('/', auth, create) //新建话题
router.get('/:id', checkAnswerExist, findById) //获取特定话题
router.patch('/:id', auth, checkAnswerExist, checkAnswerer, update) //修改话题
router.delete('/:id', auth, checkAnswerExist, checkAnswerer, del) //修改话题

module.exports = router
