const path = require('path')
const express = require('express')
const logger = require('morgan')
const proxy = require('http-proxy-middleware')
const compression = require('compression')
const { publicPath, port, publicURL, NODE_ENV, __DEV__, proxyTarget } = require('../config/env')

const app = express()
const srcFolder = __DEV__ ? 'src' : 'dist'

app.use(logger('dev'))

app.use(
  compression({
    filter: (req, res) => {
      if (req.headers['x-no-compression']) return false
      return compression.filter(req, res)
    },
  }),
)

app.use(express.static(path.resolve(srcFolder)))
// login example
app.use('/api/v1/users/current', (req, res) => res.json({ id: 1 }))
app.use('/api/v1', proxy({ target: proxyTarget, changeOrigin: true }))

if (__DEV__) {
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')

  const config = require('../config/webpack.dev')
  const bundler = webpack(config)

  app.use(
    webpackDevMiddleware(bundler, {
      publicPath,
      stats: config.stats,
    }),
  )

  app.use(
    webpackHotMiddleware(bundler, {
      log: false,
      heartbeat: 2000,
    }),
  )

  app.use('/', (req, res) => {
    const filename = path.join(bundler.outputPath, 'index.html')
    const result = bundler.outputFileSystem.readFileSync(filename, 'utf-8')
    res.send(result)
    res.end()
  })
} else {
  app.use('/', (req, res) => res.sendfile(path.join(srcFolder, publicPath, 'index.html')))
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.json({ error: err.message })
})

app.listen(port, () => {
  console.log(NODE_ENV)
  console.log(`server running ${publicURL}`)
})
