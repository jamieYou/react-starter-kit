// Karma configuration
// Generated on Mon Nov 27 2017 15:04:19 GMT+0800 (CST)

const webpack = require('webpack')
const { resolve, shareRules, postcss, GLOBALS } = require('./webpack.base.js')

module.exports = function (config) {
  config.set({

    // 根路径，后面配置的基本所有相对路径都会根据这个路径来构造。
    basePath: '../',


    // 使用到的框架
    // 目前支持的框架： https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],


    // 将会在浏览器里面执行的代码
    files: [
      {
        pattern  : 'test/main.js',
        watched  : false,
        served   : true,
        included : true
      }
    ],


    // 需要从 files 中排除掉的文件
    exclude: [],


    // 需要做预处理的文件，以及这些文件对应的预处理器。
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      // add webpack as preprocessor
      'test/**/*.js': ['webpack']
    },

    webpack: {
      resolve,
      plugins: [
        new webpack.DefinePlugin(GLOBALS),
        new webpack.LoaderOptionsPlugin({
          options: {
            debug: true,
            noInfo: true,
            postcss
          }
        }),
      ],
      module: {
        rules: shareRules
      }
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // 启用/禁用监视文件变化重新执行测试的功能
    autoWatch: true,


    // 要测试的目标环境
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    client: {
      mocha: {
        timeout: 6000 // 6 seconds - upped from 2 seconds
      }
    }
  })
}
