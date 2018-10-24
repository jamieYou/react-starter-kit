const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const merge = require('webpack-merge')
const { publicPath, distPath, viewPath, NODE_ENV, favicon } = require('./env')
const baseConfig = require('./webpack.base.js')

module.exports = merge(baseConfig, {
  mode: 'production',
  entry: {
    main: './index'
  },
  output: {
    path: distPath,
    publicPath,
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
  },
  devtool: NODE_ENV === 'staging' ? 'source-map' : void 0,
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(viewPath, 'template.html'),
      filename: path.join(distPath, 'main.html'),
      favicon,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      allChunks: true
    }),
  ],
})
