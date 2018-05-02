# react-mobx-starter-kit

  这个启动包的是为了让你使用一整套最新react的生态，所有都是可配置，富特性，基于webpack已经提供代码热加载，使用less预处理css，代码分割等等更多。

# 更新日志
  [v1.1.1](docs/v1.1.1.md)

# 特性
  * [react](https://doc.react-china.org/)
  * [mobx](http://cn.mobx.js.org/)
  * [react-router@v4](http://reacttraining.cn/)
  * [webpack](https://doc.webpack-china.org/)
  * [babel](https://babeljs.cn/)
  * [express](http://www.expressjs.com.cn/)
  * [eslint](http://eslint.cn/)
  * [flow](https://flow.org/en/)

# 需求配置
  * node
  * npm
  * yarn

# 开始
```
$ git clone https://github.com/jamieYou/react-mobx-starter-kit.git
$ cd react-mobx-starter-kit
$ yarn            # Install project dependencies
$ yarn start       # Compile and launch
```

# 脚本
|`npm run <script>`|解释|
|------------------|-----------|
|`start`|服务启动在3000端口，代码热替换开启。|
|`staging`|编译程序到dist目录下（默认目录~/dist）。|
|`build`|编译程序到dist目录下（默认目录~/dist）。|
|`start:prod`|在production环境下打包代码，并启动node服务，均不具备热加载功能|
|`lint`|检查所有前端js文件是否规范。|

# 程序目录
```
.
├── config                   # webpack配置文件
├── script                   # node脚本
│   └── server.js            # 服务端程序入口文件
├── src                      # 前端目录
│   ├── component            # 全局可复用的表现组件
│   ├── constants            # 常量（包括类型声明文件）
│   ├── image                # 图片
│   ├── model                # 数据模型的接口类型文件
│   ├── routes               # 主路由和异步分割点，页面级别的上层react组件都放在这里
│   │   ├── index.js         # 启动主程序路由
│   │   └── xxx-page         # 页面级别的文件夹
│   │       ├── index.js     # 页面组件
│   │       └── index.less   # 页面样式
│   ├── store                # mobx管理
│   │   ├── xxx-store.js     # 数据模型(Model)
│   │   └── helper           # 帮助方法
│   ├── utils                # 可复用的帮助方法
│   └── index.js             # 程序启动和渲染 
└── views                    # html模板文件
```
  
# 关于babel - 打包优化
  这里主要讲一下 babel-presets-env。使用babel-presets-env 代替 babel-presets-2015有以下特点。
  
  1. 代码中es6的import语法可以配置成不编译，由webpack来提供语法支持。这样的好处是可以利用webpack的tree-shaking来优化代码，自动去掉没使用到的代码。
  2. 优化babel-polyfill。总所周知，babel只转换语法，对于新的api、新的类（Promise,Map）需要加入插件来支持。而babel-polyfill包含了所有es6以上的api，不管你有没有使用。
  而babel-presets-env能对babel-polyfill进行拆分，只保留业务代码里所用到的部分api。

  其他小插件就不一一解析了。

# 样式
  1. 默认样式库为antd-mobile
  2. 支持less处理。less的主题文件在 config/theme.js 里，参考less-loader的modifyVars特性
  3. postCss默认开启autoprefixer和rem转换处理
  4. 默认调用[utils/mobileHack.js](utils/mobileHack.js)，配合rem的工具

# 服务端
  开发环境下使用express作为服务器，提供了webpack-dev-middleware 和 webpack-hot-middleware（代码热替换）。

# 关于代码规范
## 前端模块规范
  src目录下的每个模块都有一个index文件，用于导出当前模块的所有公开内容。当引入时，引入模块的index文件。
  
  以component为例

  ```
  // 应当这样做
  // component/index.js
  export CustomList from './custom-list'

  // 导入时
  import { CustomList } from '../../component'
  
  // 而不是
  import CustomList from '../../component/custom-list'
  ```
  
  为了不出现，在导入模块时，目录级别过于复杂的情况。我为每个模块都定义了绝对路径。
  
  以component为例

  ```
  // 应当这样做
  import { CustomList } from '@component'
  
  // 而不是
  import { CustomList } from '../../component'
  ```

  具体配置在 [config/webpack.base.js](config/webpack.base.js#L20) 里。
  
## Flow
  查阅 [flow.md](docs/flow.md)

# 案例
  [c-node-v2](https://github.com/jamieYou/c-node-v2)
