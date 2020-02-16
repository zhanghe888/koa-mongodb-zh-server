const Koa = require('koa')
const koaBody = require('koa-Body')
const koaStatic = require('koa-static')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const mongoose = require('mongoose')
const path = require('path')
const app = new Koa()
const routing = require('./routes')
const { connectionStr } = require('./config')
// 利用mongoose连接远程的服务器 mondoDB Atlas
mongoose.connect(
  connectionStr,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log('mongoDB connect success')
)
mongoose.connection.on('error', console.error)
//使用findOneAndUpdate()更新数据库的时候，会发现有条警告信息:
// DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify` option set to false are deprecated
// 原因是因为:findOneAndUpdate()内部会使用findAndModify驱动，驱动即将被废弃，所以弹出警告！
// 在使用mongose时全局设置:
mongoose.set('useFindAndModify', false)
app.use(koaStatic(path.join(__dirname, 'public')))
// 如果是生产环境就不把堆栈信息(stack)返回给客户端
app.use(
  error({
    postFormat: (e, { stack, ...rest }) =>
      process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
  })
)
app.use(
  koaBody({
    multipart: true, // 启动文件格式
    formidable: {
      uploadDir: path.join(__dirname, '/public/uploads'), // 文件上传目录
      keepExtensions: true // 保留扩展名，默认为false
    }
  })
)
app.use(parameter(app))
routing(app)
app.listen(3000, () => console.log('server is running at port 3000'))
