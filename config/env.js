const path = require('path')

module.exports = {
  port: process.env.PORT || 8000,
  proxyTarget: 'http://127.0.0.1:3000',
  publicPath: '/',
  srcPath: path.resolve('src'),
  get distPath() {
    return path.join(__dirname, '../dist')
  },
  viewPath: path.resolve('views'),
  NODE_ENV: process.env.NODE_ENV || 'development',
  get __DEV__() {
    return this.NODE_ENV === 'development' || this.NODE_ENV === 'test'
  },
  get publicURL() {
    return `http://127.0.0.1:${this.port}${this.publicPath}`
  },
  get favicon() {
    return path.join(this.srcPath, 'image/favicon.ico')
  },
}
