import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import ViewController from './view-controller'
import { autoBind } from '@utils'

export function reactRouterCache(App: Component) {
  return class ReactNavigation extends Component {
    props: {
      children: Switch
    }

    @autoBind
    renderRouter({ location, history, match }) {
      location.key = location.key || 'root'
      const props = {
        match,
        location,
        history,
        App,
        routers: this.props.children
      }
      return <ViewController {...props}/>
    }

    render() {
      return <Route render={this.renderRouter}/>
    }
  }
}
