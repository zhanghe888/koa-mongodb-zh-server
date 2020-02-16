const path = require('path')
class HomeCtl {
  index(ctx) {
    ctx.body = `<h1>这是主页</h1>`
  }
  upload(ctx) {
    const file = ctx.request.files.file
    // file.path为该文件的绝对路径，那么需要转化为http的连接的url给前端
    const basename = path.basename(file.path) // 获得文件名（文件名+扩展名）
    // ctx.origin就是localhost:3000
    // 生成图片连接返回给前端
    ctx.body = { url: `${ctx.origin}/uploads/${basename}` }
  }
}
module.exports = new HomeCtl()
