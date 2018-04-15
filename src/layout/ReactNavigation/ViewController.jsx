import React, { Component } from 'react'
import { Switch } from 'react-router-dom'
import PropTypes from 'prop-types'
import ViewModal from './ViewModal'
import { autoBind } from '@utils'
import type { location, history, match } from '@constants'

type propsType = {
  routers: Switch,
  location: location,
  history: history,
  match: match,
  App: Component,
}

export default class ViewController extends Component {
  static childContextTypes = {
    onReshow: PropTypes.func
  }

  props: propsType

  locationList: Map<string, location>

  reshowList: Map<location.key, Function[]> = new Map()

  constructor(props) {
    super(props)
    const { location } = this.props
    this.locationList = new Map([
      [location.key, location]
    ])
  }

  getChildContext() {
    return { onReshow: this.onReshowPage }
  }

  componentWillReceiveProps(nextProps: propsType) {
    const { location } = this.props
    const { history: { action }, location: nextLocation } = nextProps
    if (action === 'PUSH') {
      this.addLocation(nextLocation.key, nextLocation)
    }

    else if (action === 'POP') {
      const nextKey = nextLocation.key
      this.removeLocation(location.key)
      this.unReshowPage(location.key)

      if (!this.locationList.has(nextKey)) {
        this.addLocation(nextKey, nextLocation)
      } else {
        this.tryReshowPage(nextKey)
      }
    }

    else if (action === 'REPLACE') {
      this.replaceLocation(location.key, nextLocation.key, nextLocation)
      this.unReshowPage(location.key)
    }
  }

  @autoBind
  onReshowPage(key, func) {
    const funcList = this.reshowList.get(key) || []
    funcList.push(func)
    this.reshowList.set(key, funcList)
  }

  tryReshowPage(key) {
    const funcList = this.reshowList.get(key)
    funcList && funcList.forEach(func => func())
  }

  unReshowPage(key) {
    this.reshowList.delete(key)
  }

  addLocation(key, nextLocation) {
    this.locationList.set(key, nextLocation)
  }

  removeLocation(key) {
    this.locationList.delete(key)
  }

  resetLocation(key, nextLocation) {
    this.locationList.set(key, nextLocation)
  }

  replaceLocation(key, nextKey, nextLocation) {
    this.removeLocation(key)
    this.addLocation(nextKey, nextLocation)
  }

  mapLocation(callback: (value: location, key: string) => any) {
    const result = []
    this.locationList.forEach((value, key) => {
      result.push(callback(value, key))
    })
    return result
  }

  get lastLocationKey() {
    return [...this.locationList.keys()].pop()
  }

  render() {
    const { App, routers, match, location, history } = this.props
    return (
      <App match={match} location={location} history={history}>
        {
          this.mapLocation((location, key) => {
            const display = key === this.lastLocationKey ? null : 'none'
            return (
              <ViewModal id={key} key={key} location={location} display={display}>
                {
                  React.cloneElement(routers, { location })
                }
              </ViewModal>
            )
          })
        }
      </App>
    )
  }
}
