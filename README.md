# react-starter-kit
  这个启动包的是为了让你使用一整套最新react的生态，所有都是可配置，富特性，基于webpack已经提供代码热加载，使用less预处理css，代码分割等等更多。

# 特性
  * [react](https://doc.react-china.org/)
  * [mobx](http://cn.mobx.js.org/)
  * [react-router@v4](http://reacttraining.cn/)
  * [webpack](https://doc.webpack-china.org/)
  * [babel](https://babeljs.cn/)
  * [express](http://www.expressjs.com.cn/)
  * [eslint](http://eslint.cn/)

# 需求配置
  * node
  * npm
  * yarn

# 开发脚本
```
$ npx https://github.com/jamieYou/react-starter-kit.git create # 按照命令提示输入选项
$ cd project_name
$ yarn            # Install project dependencies
$ yarn start       # Compile and launch
```

# 测试脚本
```
$ yarn
$ yarn lint
```

# 部署脚本
```
$ yarn
$ NODE_ENV=xxx yarn build # NODE_ENV 默认为 production
$ ... # 拷贝 dist 目录到服务器的静态文件目录
```

# 程序目录
```
.
├── config                   # 配置文件
├── script                   # node脚本
│   └── server.js            # 服务端程序入口文件
├── src                      # 前端目录
│   ├── app                  # 启动主程序
│   ├── component            # 全局可复用的表现组件
│   ├── constants            # 常量
│   ├── image                # 图片
│   ├── routes               # 主路由和异步分割点，页面级别的上层react组件都放在这里
│   │   └── xxx-page         # 页面级别的文件夹
│   │       ├── index.jsx    # 页面组件
│   │       └── index.less   # 页面样式
│   ├── store                # mobx管理
│   │   └── xxx-store.js     # 数据模型(Model)
│   ├── style                # 全局 style
│   ├── utils                # 可复用的帮助方法
│   └── index.js             # 程序启动和渲染 
└── views                    # html模板文件
```
  
# 样式
  1. 默认样式库为 antd-mobile 或 antd
  2. 支持less处理。less的主题文件在 config/theme.js 里，参考less-loader的modifyVars特性
  3. postCss默认开启autoprefixer和rem转换处理

# 服务端
  开发环境下使用express作为服务器，提供了webpack-dev-middleware 和 webpack-hot-middleware（代码热替换）。

# 环境变量
  1. PORT(前端服务器的端口)
  2. API_URL(api代理地址)

支持 .env 文件
