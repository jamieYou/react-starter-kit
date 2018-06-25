const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const { publicPath, viewPath, favicon } = require('./env')
const baseConfig = require('./webpack.base.js')

module.exports = merge(baseConfig, {
  mode: 'development',
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
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(viewPath, "template.html"),
      filename: 'index.html',
      favicon,
    }),
  ],
})
