const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const { publicPath, srcPath, distPath, viewPath, NODE_ENV, favicon } = require('../config/env')
const { resolve, shareRules, stats, GLOBALS } = require('./webpack.base.js')

module.exports = {
  mode: 'production',
  context: srcPath,
  entry: {
    main: './index',
  },
  output: {
    path: distPath,
    publicPath,
    filename: "[name].[chunkhash].js",
    chunkFilename: '[name].[chunkhash].js',
  },
  resolve,
  devtool: NODE_ENV === 'staging' ? 'source-map' : void 0,
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    new webpack.DefinePlugin(GLOBALS),
    new webpack.ContextReplacementPlugin(/moment(\/|\\)locale$/, /zh-cn/),
    new HtmlWebpackPlugin({
      template: path.join(viewPath, "template.html"),
      filename: path.join(distPath, "index.html"),
      inject: true,
      favicon,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      allChunks: true
    }),
    // new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)({
    //   analyzerPort: name === 'client' ? 8888 : 8889
    // }),
  ],
  module: {
    rules: shareRules
  },
  stats,
}
