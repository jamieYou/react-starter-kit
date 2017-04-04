const os = require('os')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJsParallelPlugin = require('webpack-uglify-parallel')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const { postcss, resolve, shareRules, GLOBALS, srcPath, dllPath, distPath, viewPath, dllContext } = require('./webpack.base.js')

module.exports = {
  context: srcPath,
  entry: {
    index: [
      './index'
    ]
  },
  output: {
    path: distPath,
    publicPath: '/',
    filename: "app.[name].[chunkhash].js",
    chunkFilename: '[name].[chunkhash:5].chunk.js',
  },
  resolve,
  devtool: false,
  plugins: [
    new webpack.DllReferencePlugin({
      context: dllContext,
      manifest: require(path.join(dllPath, 'vendor-manifest.min.json')),
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        bail: true,
        debug: false,
        devtool: false, // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
        noInfo: true, // set to false to see a list of every file being bundled.
        postcss,
      }
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin(GLOBALS), // Tells React to build in prod mode. https://facebook.github.io/react/downloads.htmlnew webpack.HotModuleReplacementPlugin())
    new UglifyJsParallelPlugin({
      workers: os.cpus().length,
      mangle: true,
      compressor: {
        warnings: false,
        drop_console: true,
        drop_debugger: true
      }
    }),
    new HtmlWebpackPlugin({
      template: path.join(viewPath, "template.html"),
      filename: path.join(distPath, "index.html"),
      inject: true,
      chunks: ['index'],
    }),
    new AddAssetHtmlPlugin([
      { filepath: path.join(dllPath, "vendor.min.js"), hash: true, includeSourcemap: false },
      { filepath: path.join(dllPath, "vendor.min.css"), hash: true, includeSourcemap: false, typeOfAsset: 'css' }
    ]),
    new ExtractTextPlugin({
      filename: 'app.[name].[contenthash].css',
      allChunks: true
    }),
  ],
  module: {
    rules: [
      ...shareRules,
    ]
  }
}
