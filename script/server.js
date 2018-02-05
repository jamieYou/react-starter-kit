const express = require('express')
const path = require('path')
const logger = require('morgan')
const proxy = require('http-proxy-middleware')
const _ = require('lodash')
const compression = require('compression')
const ipv4 = require('ipv4')

const app = express()
const _DEV_ = _.get(process.env, 'NODE_ENV', 'development') === 'development'
const port = process.env.PORT || 8000
const publicPath = _DEV_ ? 'src' : 'dist'
const proxyTarget = 'https://cnodejs.org' || `http://${ipv4}:3000`
const rootPath = path.join(__dirname, '../')

app.set('views', path.join(rootPath, 'views'))
app.use(logger('dev'))

app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false
    }
    return compression.filter(req, res)
  }
}))

app.use(express.static(path.join(rootPath, publicPath)))
app.use('/api/v1', proxy({ target: proxyTarget, changeOrigin: true }))

if (_DEV_) {
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')

  const config = require('../config/webpack.dev')
  const bundler = webpack(config)

  app.use(webpackDevMiddleware(bundler, {
    publicPath: config.output.publicPath,
    stats: { colors: true }
  }))

  app.use(webpackHotMiddleware(bundler, {
    log: false,
    heartbeat: 2000
  }))

  app.use('/', (req, res) => {
    const filename = path.join(bundler.outputPath, 'index.html')
    const result = bundler.outputFileSystem.readFileSync(filename)
    res.set('content-type', 'text/html')
    res.send(result)
    res.end()
  })
} else {
  app.use('/', (req, res) => res.sendfile('dist/index.html'))
}

app.use(function (req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.json(err)
})

app.listen(port, () => {
  console.warn(process.env.NODE_ENV || 'development')
  console.log(`server running @${port}`)
})
