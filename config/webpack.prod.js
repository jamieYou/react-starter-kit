const os = require('os')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJsParallelPlugin = require('webpack-uglify-parallel')
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin')
const { vendor } = require('./vendor.config.js')
const { resolve, shareRules, GLOBALS, srcPath, distPath, viewPath, NODE_ENV, stats } = require('./webpack.base.js')

module.exports = {
  context: srcPath,
  entry: {
    main: './index',
    vendor,
  },
  output: {
    path: distPath,
    publicPath: '/',
    filename: "app.[name].[chunkhash].js",
    chunkFilename: '[name].[chunkhash:5].chunk.js',
  },
  resolve,
  devtool: "cheap-module-source-map",
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin(GLOBALS),
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
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      filename: 'manifest.js',
      minChunks: Infinity,
    }),
    new InlineManifestWebpackPlugin({
      name: 'webpackManifest'
    }),
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
