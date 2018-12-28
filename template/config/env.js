const path = require('path')
const fs = require('fs')
const env = require('node-env-file')

const envFile = path.resolve('.env')
if (fs.existsSync(envFile)) env(envFile)

module.exports = {
  port: process.env.PORT || 8000,
  proxyTarget: process.env.API_URL || 'http://127.0.0.1:3000',
  publicPath: '/',
  srcPath: path.resolve('src'),
  viewPath: path.resolve('views'),
  NODE_ENV: process.env.NODE_ENV || 'development',
  get distPath() {
    return path.join(__dirname, '../dist', this.publicPath)
  },
  get __DEV__() {
    return this.NODE_ENV === 'development' || this.NODE_ENV === 'test'
  },
  get publicURL() {
    return `http://127.0.0.1:${this.port}${this.publicPath}`
  },
  get favicon() {
    return path.join(this.srcPath, 'image/favicon.ico')
  },
  get WEB_ENV() {
    return this.NODE_ENV === 'development' ? 'development' : 'production'
  },
}
