const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { publicPath, srcPath, viewPath, favicon } = require('../config/env')
const { resolve, shareRules, stats, GLOBALS } = require('./webpack.base.js')

module.exports = {
  mode: 'development',
  context: srcPath,
  entry: {
    main: [
      'react-hot-loader/patch',
      'webpack-hot-middleware/client?reload=true',
      './index'
    ],
  },
  output: {
    publicPath,
    filename: "[name].bundle.js",
    chunkFilename: '[name].chunk.js',
  },
  resolve,
  devtool: 'cheap-module-eval-source-map',
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        default: false,
      }
    },
  },
  plugins: [
    new webpack.DefinePlugin(GLOBALS),
    new webpack.ContextReplacementPlugin(/moment(\/|\\)locale$/, /zh-cn/),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(viewPath, "template.html"),
      filename: 'index.html',
      inject: true,
      favicon,
    }),
    // new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin),
  ],
  module: {
    rules: shareRules
  },
  stats,
}
