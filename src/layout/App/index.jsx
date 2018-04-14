import React, { Component } from 'react'
import { ActivityIndicator } from 'antd-mobile'
import { reactRouterCache } from '../ReactNavigation'
import { routerStore, authStore } from '@store'
import './index.less'

@reactRouterCache
export default class App extends Component {
  props: {
    children: any
  }

  state = {
    appLoading: true,
  }

  componentWillMount() {
    routerStore.setRouter(this.props)
    authStore.fetchData().finally(() => this.setState({ appLoading: false }))
  }

  componentWillReceiveProps(newProps) {
    routerStore.setRouter(newProps)
  }

  render() {
    if (this.state.appLoading) return <ActivityIndicator size="large" toast/>
    return this.props.children
  }
}
