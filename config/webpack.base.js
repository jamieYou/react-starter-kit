const path = require('path')
const pxtorem = require('postcss-pxtorem')
const autoprefixer = require('autoprefixer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const NODE_ENV = exports.NODE_ENV = process.env.NODE_ENV || 'development'
const __DEV__ = exports.__DEV__ = NODE_ENV === 'development' || NODE_ENV === 'test'

const srcPath = exports.srcPath = path.join(__dirname, "../src")
exports.dllPath = path.join(__dirname, "../dll")
exports.distPath = path.join(__dirname, "../dist")
exports.viewPath = path.join(__dirname, "../views")
exports.dllContext = path.join(__dirname, "../")

exports.GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
  __DEV__
}

exports.postcss = () =>
  [pxtorem({
    rootValue: 100,
    propWhiteList: [],
    minPixelValue: 2,
  }), autoprefixer]

exports.resolve = {
  alias: {
    '@store': path.join(srcPath, "store"),
    '@component': path.join(srcPath, "component"),
    '@api': path.join(srcPath, "api"),
    '@utils': path.join(srcPath, "utils"),
    '@constants': path.join(srcPath, "constants"),
    '@image': path.join(srcPath, "image"),
    '@routes': path.join(srcPath, "routes"),
    mobx: 'mobx/lib/mobx.js',
    MobX: 'mobx/lib/mobx.js',
  },
  extensions: ['.js', '.jsx', '.json']
}

exports.shareRules = [
  {
    test: /(\.js|\.jsx)$/,
    exclude: /node_modules/,
    use: ['babel-loader']
  },
  { test: /\.eot(\?v=\d+.\d+.\d+)?$/, use: 'file-loader' },
  { test: /\.(woff|woff2)$/, use: 'file-loader' },
  { test: /\.ttf(\?v=\d+.\d+.\d+)?$/, use: 'file-loader' },
  { test: /\.(jpe?g|png|gif|svg)$/i, use: 'url-loader?limit=10000' },
  { test: /\.ico$/, use: 'file-loader?name=[name].[ext]' },
  {
    test: /(\.css|\.less)$/,
    include: path.join(__dirname, "../node_modules"),
    use: __DEV__
      ? ['style-loader', 'css-loader', 'postcss-loader', `less-loader?{"modifyVars":${JSON.stringify(require('./theme'))}}`]
      : ExtractTextPlugin.extract({
        use: ['css-loader?minimize', 'postcss-loader', `less-loader?{"modifyVars":${JSON.stringify(require('./theme'))}}`]
      })
  },
  {
    test: /(\.css|\.scss)$/,
    include: srcPath,
    use: __DEV__
      ? ['style-loader', 'css-loader?sourceMap', 'postcss-loader', 'sass-loader']
      : ExtractTextPlugin.extract({
        use: ['css-loader?minimize', 'postcss-loader', 'sass-loader']
      })
  },
]
