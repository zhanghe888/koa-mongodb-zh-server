module.exports = {
  secret: 'zh-jwt-secret',
  connectionStr:
    'mongodb+srv://zh:mei@520225@zh-h1cc2.mongodb.net/test?retryWrites=true&w=majority'
}
// 上面当中的两个密码在生产当中是通过环境变量获取的，不能直接这样写
