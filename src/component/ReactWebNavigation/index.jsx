import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import ViewController from './ViewController'
import type { htmlNode } from '@constants'

export function reactRouterCache(App: Component) {
  return class ReactWebNavigation extends Component {
    props: {
      children: htmlNode
    }

    render() {
      return (
        <Route
          render={({ location, history, match }) => {
            location.key = location.key || 'root'
            const props = {
              match,
              location,
              history,
              App,
              routers: this.props.children
            }
            return <ViewController {...props}/>
          }}
        />
      )
    }
  }
}
