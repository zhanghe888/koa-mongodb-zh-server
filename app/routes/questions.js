const Router = require('koa-router')
// const jsonwebtoken = require('jsonwebtoken')
const jwt = require('koa-jwt')
// koa-jwt内置了jsonwentoken
const router = new Router({ prefix: '/questions' })
const { secret } = require('../config')
const {
  find,
  findById,
  create,
  update,
  delete: del,
  checkQuestionExist,
  checkQuestioner
} = require('../controllers/questions')
const auth = jwt({ secret })

router.get('/', find) //获取话题列表
router.post('/', auth, create) //新建话题
router.get('/:id', checkQuestionExist, findById) //获取特定话题
router.patch('/:id', auth, checkQuestionExist, checkQuestioner, update) //修改话题
router.delete('/:id', auth, checkQuestionExist, checkQuestioner, del) //修改话题

module.exports = router
