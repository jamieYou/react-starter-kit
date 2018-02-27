const path = require('path')
const pxtorem = require('postcss-pxtorem')
const autoprefixer = require('autoprefixer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const NODE_ENV = exports.NODE_ENV = process.env.NODE_ENV || 'development'
const __DEV__ = exports.__DEV__ = NODE_ENV === 'development' || NODE_ENV === 'test'

const srcPath = exports.srcPath = path.join(__dirname, "../src")
exports.distPath = path.join(__dirname, "../dist")
exports.viewPath = path.join(__dirname, "../views")

exports.GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
  'process.env.__DEV__': __DEV__,
}

exports.resolve = {
  modules: [path.join(__dirname, '../node_modules')],
  alias: {
    '@store': path.join(srcPath, "store"),
    '@model': path.join(srcPath, "model"),
    '@component': path.join(srcPath, "component"),
    '@utils': path.join(srcPath, "utils"),
    '@constants': path.join(srcPath, "constants"),
    '@image': path.join(srcPath, "image"),
    '@routes': path.join(srcPath, "routes"),
    '@style': path.join(srcPath, "style"),
    mobx: 'mobx/lib/mobx.module.js',
  },
  extensions: ['.js', '.jsx']
}

exports.stats = {
  colors: true,
  hash: true,
  version: true,
  children: false,
  chunks: false,
  modules: false,
  chunkModules: false,
}

const jsUseLoaders = ['babel-loader', 'eslint-loader']
const lessLoaderOptinos = `less-loader?{"modifyVars":${JSON.stringify(require('./theme'))}}`
const postcssLoaderOptinos = {
  loader: 'postcss-loader',
  options: {
    plugins: [
      pxtorem({
        rootValue: 50,
        propWhiteList: [],
        minPixelValue: 2,
      }),
      autoprefixer()
    ]
  }
}

exports.shareRules = [
  {
    test: /\.js$/,
    exclude: /node_modules/,
    use: jsUseLoaders
  },
  {
    test: /\.jsx$/,
    exclude: /node_modules/,
    use: __DEV__ ? ['react-hot-loader/webpack', ...jsUseLoaders] : jsUseLoaders
  },
  { test: /\.eot(\?v=\d+.\d+.\d+)?$/, use: 'file-loader' },
  { test: /\.(woff|woff2)$/, use: 'file-loader' },
  { test: /\.ttf(\?v=\d+.\d+.\d+)?$/, use: 'file-loader' },
  { test: /\.(jpe?g|png|gif)$/i, use: 'url-loader?limit=10000' },
  { test: /\.ico$/, use: 'file-loader?name=[name].[ext]' },
  { test: /\.svg$/, use: 'svg-sprite-loader' },
  {
    test: /(\.css|\.less)$/,
    use: __DEV__
      ? ['style-loader', 'css-loader?sourceMap', postcssLoaderOptinos, lessLoaderOptinos]
      : ExtractTextPlugin.extract({
        use: ['css-loader?minimize', postcssLoaderOptinos, lessLoaderOptinos]
      })
  },
]
