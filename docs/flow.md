# flow的简介
flow 是 facebook 出的一个js类型声明插件。语法类似typescript，但ts对类型非常严格，会有编译不通过的风险。
而flow的类型声明是可选的，对原有代码的侵入性不高，比ts会更灵活。

# flow 和 js的鸭子类型
为什么需要类型？js里面的数组和对象都很方便，可以随意的互相嵌套，数组的元素可能是一个对象，对象的一个字段可能值为数组，并且对象不需要通过class来实例化。
这导致只看代码的情况下，并不能知道一个对象的整体结构，特别是由ajax返回的数据集合。

适用场景：
1. 处理api的数据的模型(Model)，这个Model可能是redux里面的store，或者mobx里面的store。
可以参考 src/store 里面的js。

2. 处理Promise的返回值，promise和一般的函数不一样，需要根据 resolve 和 reject 来决定结果。可以用flow事先声明成功和失败的结果。

3. 用于基于class语法的面向对象编程。例如react

# flow 和 prop-types

## 关于 prop-types

prop-types是用于react组件的实例变量props和context的类型声明语法。在react@v16之前内置在react里面，但在之后，被抽取出来作为一个独立库。
有部分的组件库（antd）已经开始不引入react的prop-types，而选择单独引入名为"prop-types"的库。而react官方也不要求开发者声明props的类型。


## flow和react

flow强大的类型声明功能同样能作用于react组件，而且语法非常灵活，足以替代prop-types。

一个简单的例子 

```
import { Component } from 'react'
import PropTypes from 'prop-types'

export default class App extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    data: PropTypes.object,
  }

  render() {
  }
}
```

```
import { Component } from 'react'
import type { htmlNode } from '@constants'

type topic = {
  title: string,
  content: string
}

export default class App extends Component {
  props: {
    children: htmlNode,
    id: number,
    title: string,
    data?: {
      content: string,
      replies: topic[]
    }
  }

  render() {
  }
}

```
