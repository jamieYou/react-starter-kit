const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const { resolve, shareRules, GLOBALS, srcPath, distPath, viewPath, stats } = require('./webpack.base.js')

module.exports = {
  mode: 'production',
  context: srcPath,
  entry: {
    main: './index',
  },
  output: {
    path: distPath,
    publicPath: '/',
    filename: "[name].[chunkhash].js",
    chunkFilename: '[name].[chunkhash].js',
  },
  resolve,
  devtool: "cheap-module-source-map",
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    new webpack.DefinePlugin(GLOBALS),
    new HtmlWebpackPlugin({
      template: path.join(viewPath, "template.html"),
      filename: path.join(distPath, "index.html"),
      inject: true,
    }),
    new ExtractTextPlugin({
      filename: '[name].[contenthash].css',
      allChunks: true
    }),
  ],
  module: {
    rules: shareRules
  },
  stats,
}
