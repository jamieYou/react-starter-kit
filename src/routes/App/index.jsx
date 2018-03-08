import { Component } from 'react'
import { reactRouterCache } from '@component'
import './index.less'

@reactRouterCache
export default class App extends Component {
  props: {
    children: any
  }

  render() {
    return this.props.children
  }
}
