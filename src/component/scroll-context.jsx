import React, { Component } from 'react'
import { Collection, WebAPIStore, observer } from "@store"
import type ScrollView from './scroll-view'

@observer
export default class ScrollContext extends Component {
  props: {
    store: Collection | WebAPIStore,
    children: ScrollView,
  }

  isCollection = this.props.store instanceof Collection

  render() {
    const { isComplete, isFulfilled, fetchData, fetchMoreData, reFetchData } = this.props.store
    return React.cloneElement(this.props.children, {
      onRefresh: this.isCollection ? reFetchData : fetchData,
      onEndReached: this.isCollection && !isComplete && isFulfilled ? fetchMoreData : null,
    })
  }
}
