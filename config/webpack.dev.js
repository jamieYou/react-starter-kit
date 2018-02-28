const path = require('path')
const IPv4 = require('ipv4')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { resolve, shareRules, GLOBALS, srcPath, viewPath, stats } = require('./webpack.base.js')

const publicPath = `http://${IPv4}:${process.env.PORT || '8000'}/`

console.warn(publicPath)

module.exports = {
  context: srcPath,
  entry: {
    main: [
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
  plugins: [
    new webpack.DefinePlugin(GLOBALS),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(viewPath, "template.html"),
      filename: 'index.html',
      inject: true,
    }),
  ],
  module: {
    rules: shareRules
  },
  stats,
}
