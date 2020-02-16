const User = require('../models/users')
const Question = require('../models/questions')
const jsonwebtoken = require('jsonwebtoken')
const { secret } = require('../config')
class UsersCtl {
  async find(ctx) {
    const { per_page = 10 } = ctx.query
    const page = Math.max(ctx.query.page * 1, 1) - 1
    const perPage = Math.max(per_page * 1, 1)
    ctx.body = await User.find({ name: new RegExp(ctx.query.q) })
      .limit(perPage)
      .skip(page * perPage)
  }
  async findById(ctx) {
    // 过滤查询
    const { fields = '' } = ctx.query
    const selectFields = fields
      .split(';')
      .filter(f => f)
      .map(f => ' +' + f)
      .join('')
    console.log(selectFields)
    const populateStr = fields
      .split(';')
      .filter(f => f)
      .map(f => {
        if (f === 'employments') {
          return 'employments.company employments.job'
        }
        if (f === 'educations') {
          return 'educations.school educations.major'
        }
        return f
      })
      .join(' ')
    const user = await User.findById(ctx.params.id)
      .select(selectFields)
      .populate(populateStr)
    if (!user) {
      ctx.thorw(404, '用户不存在')
    }
    ctx.body = user
  }
  async create(ctx) {
    ctx.verifyParams({
      name: {
        type: 'string',
        required: true // 默认为true
      },
      password: { type: 'string', required: true }
    })
    const { name } = ctx.request.body
    const repeatedUser = await User.findOne({ name })
    if (repeatedUser) {
      ctx.throw(409, '用户已经存在') // 409冲突
    }
    const user = await new User(ctx.request.body).save()
    ctx.body = user
  }
  // 这是授权的方法，这个只有用户才有的，所以写在用户的控制器里是合适的
  async checkOwner(ctx, next) {
    if (ctx.params.id !== ctx.state.user._id) {
      // 只能修改自己的信息，能对别人信息进行操作
      ctx.throw(403, '没有权限')
    }
    await next()
  }
  async update(ctx) {
    ctx.verifyParams({
      name: {
        type: 'string',
        required: false // 默认为true
      },
      password: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false },
      gender: { type: 'string', required: false },
      headline: { type: 'string', required: false },
      locations: { type: 'array', itemType: 'string', required: false },
      business: { type: 'string', required: false },
      employments: { type: 'array', itemType: 'object', required: false },
      educations: { type: 'array', itemType: 'object', required: false }
    })
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user
  }
  async delete(ctx) {
    const user = await User.findByIdAndRemove(ctx.params.id)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.status = 204
  }
  async login(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    })
    const user = await User.findOne(ctx.request.body) // 寻找符合条件的第一个用户
    if (!user) {
      ctx.throw(401, '用户名和密码不正确')
    }
    const { _id, name } = user
    const token = jsonwebtoken.sign({ _id, name }, secret, { expiresIn: '1d' })
    ctx.body = { token }
  }
  async listFollowing(ctx) {
    const user = await User.findById(ctx.params.id)
      .select('+following')
      .populate('following')
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user.following
  }
  async listFollowers(ctx) {
    const users = await User.find({ following: ctx.params.id })
    ctx.body = users
  }
  async checnUserExist(ctx, next) {
    const user = await User.findById(ctx.params.id)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    await next()
  }
  async follow(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+following')
    if (!me.following.map(id => id.toString()).includes(ctx.params.id)) {
      me.following.push(ctx.params.id)
      me.save()
    }
    ctx.status = 204
  }
  async unfollow(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+following')
    const index = me.following.map(id => id.toString().indexOf(ctx.params.id))
    if (index > -1) {
      me.following.splice(index, 1)
      me.save()
    }
    ctx.status = 204
  }
  async listFollowingTopics(ctx) {
    const user = await User.findById(ctx.params.id)
      .select('+followingTopics')
      .populate('followingTopics')
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user.followingTopics
  }
  async followTopic(ctx) {
    const me = await User.findById(ctx.state.user._id).select(
      '+followingTopics'
    )
    if (!me.followingTopics.map(id => id.toString()).includes(ctx.params.id)) {
      me.followingTopics.push(ctx.params.id)
      me.save()
    }
    ctx.status = 204
  }
  async unfollowTopic(ctx) {
    const me = await User.findById(ctx.state.user._id).select(
      '+followingTopics'
    )
    const index = me.followingTopics.map(id =>
      id.toString().indexOf(ctx.params.id)
    )
    if (index > -1) {
      me.followingTopics.splice(index, 1)
      me.save()
    }
    ctx.status = 204
  }
  async listQuestions(ctx) {
    const questions = await Question.find({ questioner: ctx.params.id })
    ctx.body = questions
  }
}
module.exports = new UsersCtl()