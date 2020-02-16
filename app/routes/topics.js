const Router = require('koa-router')
// const jsonwebtoken = require('jsonwebtoken')
const jwt = require('koa-jwt')
// koa-jwt内置了jsonwentoken
const router = new Router({ prefix: '/topics' })
const { secret } = require('../config')
const {
  find,
  findById,
  create,
  update,
  checkTopicExist,
  listFollowers,
  listQuestions
} = require('../controllers/topics')
const auth = jwt({ secret })

router.get('/', find) //获取话题列表
router.post('/', auth, create) //新建话题
router.get('/:id', checkTopicExist, findById) //获取特定话题
router.patch('/:id', auth, checkTopicExist, update) //修改话题
router.get('/:id/followers', checkTopicExist, listFollowers) //修改话题
router.get('/:id/questions', checkTopicExist, listQuestions) //修改话题

module.exports = router
