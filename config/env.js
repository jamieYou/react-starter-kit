const path = require('path')
const ipv4 = require('ipv4')

module.exports = {
  port: process.env.PORT || 8000,
  proxyTarget: `http://${ipv4}:3000`,
  publicPath: '/',
  srcPath: path.resolve("src"),
  get distPath() {
    return path.join(__dirname, "../dist", this.publicPath)
  },
  viewPath: path.resolve("views"),
  NODE_ENV: process.env.NODE_ENV || 'development',
  get __DEV__() {
    return this.NODE_ENV === 'development' || this.NODE_ENV === 'test'
  },
  get publicURL() {
    return `http://${ipv4}:${this.port}${this.publicPath}`
  },
  get favicon() {
    return path.join(this.srcPath, 'image/favicon.ico')
  }
}
