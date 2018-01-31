import React, { Component } from 'react'
import { Switch } from 'react-router-dom'
import ViewModal from './ViewModal'
import { LocationEvent } from '@utils'
import type { htmlNode, location, history, match } from '@constants'

type propsType = {
  routers: htmlNode,
  location: location,
  history: history,
  match: match,
  App: Component,
}

export default class ViewController extends Component {
  props: propsType

  locationList: Map<string, location>

  constructor(props) {
    super(props)
    const { location } = this.props
    this.locationList = new Map([
      [location.key, this.formatLocation(location.key, location)]
    ])
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
      LocationEvent.destroy(location.key)

      if (!this.locationList.has(nextKey)) {
        this.addLocation(nextKey, nextLocation)
      } else {
        LocationEvent.tryReshowPage(nextKey)
      }
    }

    else if (action === 'REPLACE') {
      if (nextLocation.state && nextLocation.state.modalKey) {
        this.resetLocation(nextLocation.state.modalKey, nextLocation)
      } else {
        this.replaceLocation(location.key, nextLocation.key, nextLocation)
      }
    }
  }

  formatLocation(modalKey, location: location) {
    return Object.assign(location, { modalKey })
  }

  addLocation(key, nextLocation) {
    this.locationList.set(key, this.formatLocation(key, nextLocation))
  }

  removeLocation(key) {
    this.locationList.delete(key)
  }

  resetLocation(key, nextLocation) {
    this.locationList.set(key, this.formatLocation(key, nextLocation))
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
                <Switch location={location}>
                  {routers}
                </Switch>
              </ViewModal>
            )
          })
        }
      </App>
    )
  }
}
