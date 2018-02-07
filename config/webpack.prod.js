const os = require('os')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJsParallelPlugin = require('webpack-uglify-parallel')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const { resolve, shareRules, GLOBALS, srcPath, dllPath, distPath, viewPath, dllContext, NODE_ENV, devtool, stats } = require('./webpack.base.js')

module.exports = {
  context: srcPath,
  entry: {
    main: './index'
  },
  output: {
    path: distPath,
    publicPath: '/',
    filename: "app.[name].[chunkhash].js",
    chunkFilename: '[name].[chunkhash:5].chunk.js',
  },
  resolve,
  devtool,
  plugins: [
    new webpack.DllReferencePlugin({
      context: dllContext,
      manifest: require(path.join(dllPath, 'vendor-manifest.min.json')),
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin(GLOBALS), // Tells React to build in prod mode. https://facebook.github.io/react/downloads.htmlnew webpack.HotModuleReplacementPlugin())
    new UglifyJsParallelPlugin({
      workers: os.cpus().length,
      mangle: true,
      compressor: {
        warnings: false,
        drop_console: NODE_ENV === 'production',
        drop_debugger: true,
      }
    }),
    new HtmlWebpackPlugin({
      template: path.join(viewPath, "template.html"),
      filename: path.join(distPath, "index.html"),
      inject: true,
    }),
    new AddAssetHtmlPlugin([
      { filepath: path.join(dllPath, "vendor.min.js"), hash: true, includeSourcemap: true },
      { filepath: path.join(dllPath, "vendor.min.css"), hash: true, includeSourcemap: true, typeOfAsset: 'css' }
    ]),
    new ExtractTextPlugin({
      filename: 'app.[name].[contenthash].css',
      allChunks: true
    }),
  ],
  module: {
    rules: shareRules
  },
  stats,
}
