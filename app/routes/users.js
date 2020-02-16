const Router = require('koa-router')
// const jsonwebtoken = require('jsonwebtoken')
const jwt = require('koa-jwt')
// koa-jwt内置了jsonwentoken
const router = new Router({ prefix: '/users' })
const { secret } = require('../config')
const {
  find,
  findById,
  create,
  update,
  delete: del,
  login,
  checkOwner,
  listFollowing,
  checnUserExist,
  follow,
  unfollow,
  listFollowers,
  listFollowingTopics,
  followTopic,
  unfollowTopic,
  listQuestions
} = require('../controllers/users')
const { checkTopicExist } = require('../controllers/topics')
// 用koa-jwt做认证
const auth = jwt({ secret })
// 下面为自己写的认证中间件
// 认证的中间件，所有的操作都需要走认证，所以写在全局比较好
// 先认证才授权
// const auth = async (ctx, next) => {
//   const { authorization = '' } = ctx.request.header
//   const token = authorization.replace('Bearer ', '')
//   try {
//     const user = jsonwebtoken.verify(token, secret)
//     ctx.state.user = user
//   } catch (err) {
//     ctx.throw(401, err.message)
//   }
//   await next()
// }
router.get('/', find) //获取用户列表
router.post('/', auth, create) //添加用户
router.get('/:id', findById) //获取特定用户
router.patch('/:id', auth, checkOwner, update) //修改用户
router.delete('/:id', auth, checkOwner, del) // 删除用户
router.post('/login', login) // 登录
router.get('/:id/following', listFollowing) // 获取某个用户的关注人列表
router.get('/:id/followers', listFollowers) //获取某个用户的粉丝列表
router.put('/following/:id', auth, checnUserExist, follow) // 关注某人
router.delete('/following/:id', auth, checnUserExist, unfollow) // 取消关注某人
router.get('/:id/followingTopics', listFollowingTopics) // 获取某个用户的关注人列表
router.put('/followingTopics/:id', auth, checkTopicExist, followTopic) // 关注某人
router.delete('/followingTopics/:id', auth, checkTopicExist, unfollowTopic) // 取消关注某人
router.get('/:id/questions', listQuestions) // 获取某个用户的关注人列表
module.exports = router
