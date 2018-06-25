const path = require('path')
const webpack = require('webpack')
const pxtorem = require('postcss-pxtorem')
const autoprefixer = require('autoprefixer')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const { publicPath, NODE_ENV, __DEV__, srcPath } = require('../config/env')

const lessLoaderOptions = {
  loader: 'less-loader',
  options: { javascriptEnabled: true, modifyVars: require('./theme') }
}

const postcssLoaderOptions = {
  loader: 'postcss-loader',
  options: {
    plugins: [
      pxtorem({
        rootValue: 50,
        propWhiteList: [],
        minPixelValue: 2,
      }),
      autoprefixer({
        browsers: [
          "last 2 versions",
          "safari >= 8"
        ]
      })
    ]
  }
}

module.exports = {
  context: srcPath,
  resolve: {
    modules: [path.resolve('node_modules')],
    alias: {
      '@store': path.join(srcPath, "store"),
      '@component': path.join(srcPath, "component"),
      '@utils': path.join(srcPath, "utils"),
      '@constants': path.join(srcPath, "constants"),
      '@image': path.join(srcPath, "image"),
      '@routes': path.join(srcPath, "routes"),
      '@style': path.join(srcPath, "style"),
    },
    extensions: ['.js', '.jsx']
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
      'PUBLIC_PATH': JSON.stringify(publicPath),
    }),
    // new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)({ analyzerPort: 8889 }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: __DEV__ ? ['react-hot-loader/webpack', 'babel-loader'] : ['babel-loader']
      },
      { test: /\.eot(\?v=\d+.\d+.\d+)?$/, use: 'file-loader' },
      { test: /\.(woff|woff2)$/, use: 'file-loader' },
      { test: /\.ttf(\?v=\d+.\d+.\d+)?$/, use: 'file-loader' },
      { test: /\.(jpe?g|png|gif|svg)$/i, use: 'url-loader?limit=10000&name=[name]-[hash:5].[ext]' },
      { test: /\.ico$/, use: 'file-loader?name=[name].[ext]' },
      {
        test: /(\.css|\.less)$/,
        use: __DEV__
          ? ['style-loader', 'css-loader?sourceMap', postcssLoaderOptions, lessLoaderOptions]
          : [MiniCssExtractPlugin.loader, 'css-loader?minimize', postcssLoaderOptions, lessLoaderOptions]
      },
    ]
  },
  stats: {
    colors: true,
    hash: true,
    version: true,
    children: false,
    chunks: false,
    modules: false,
    chunkModules: false,
    warnings: false,
  },
}
