const path = require('path')
const IPv4 = require('ipv4')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const { postcss, resolve, shareRules, GLOBALS, srcPath, dllPath, viewPath, dllContext } = require('./webpack.base.js')

const publicPath = `http://${IPv4}:${process.env.PORT || '8000'}/`

console.warn(publicPath)

module.exports = {
  context: srcPath,
  entry: {
    index: [
      'react-hot-loader/patch',
      'webpack-hot-middleware/client?reload=true',
      './index'
    ]
  },
  output: {
    publicPath,
    filename: "[name].bundle.js",
    chunkFilename: '[name].chunk.js',
  },
  resolve,
  devtool: 'cheap-module-eval-source-map', // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
  plugins: [
    new webpack.DllReferencePlugin({
      context: dllContext,
      manifest: require(path.join(dllPath, 'vendor-manifest.json'))
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        debug: true,
        noInfo: true,
        postcss
      }
    }),
    new webpack.DefinePlugin(GLOBALS), // Tells React to build in prod mode. https://facebook.github.io/react/downloads.htmlnew webpack.HotModuleReplacementPlugin())
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(viewPath, "template.html"),
      filename: 'index.html',
      inject: true
    }),
    new AddAssetHtmlPlugin({
      filepath: path.join(dllPath, "vendor.js"),
    }),
  ],
  module: {
    rules: [
      ...shareRules,
    ]
  }
}
