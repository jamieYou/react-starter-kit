const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const proxy = require('http-proxy-middleware')
const _ = require('lodash')
const compression = require('compression')
const IPv4 = require('ipv4')
const open = require("open")

const app = express()
const _DEV_ = _.get(process.env, 'NODE_ENV', 'development') === 'development'
const port = process.env.PORT || 3000
const publicPath = _DEV_ ? 'src' : 'dist'
const proxyTarget = 'https://cnodejs.org'
const rootPath = path.join(__dirname, '../')

app.set('views', path.join(rootPath, 'views'))
app.set('view engine', 'jade')
app.use(favicon(path.join(rootPath, publicPath, 'favicon.ico')))
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

  app.use('/', (req, res) => res.render('layout', { name: 'index' }))
} else {
  app.use('/', (req, res) => res.sendfile('dist/index.html'))
}


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

app.listen(port, () => {
  console.warn(process.env.NODE_ENV || 'development')
  console.log(`server running @${port}`)
  open(`http://${IPv4}:${port}/`)
})
