import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { ListView, PullToRefresh } from 'antd-mobile'
import type { IObservableArray } from '@store/helper'
import type { htmlNode } from '@constants'
import { observer, computed, Collection, StoreHelper } from '@store'
import { autoBind } from '@utils'
import ListFooter from './ListFooter'
import './CustomList.less'

@observer
export default class CustomList extends Component {
  props: {
    dataList?: IObservableArray | Object<Array>,
    renderRow: Function,
    store: Collection | StoreHelper,
    initialListSize?: number,
    renderHeader?: Function | htmlNode,
    renderSectionHeader?: Function,
  }

  isCollection = this.props.store instanceof Collection

  dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
  })

  state = {
    refreshing: false
  }

  @computed
  get dataSourceResult() {
    const dataList = this.props.dataList || this.props.store.data
    if (dataList.slice) {
      return this.dataSource.cloneWithRows(dataList.slice())
    } else {
      return this.dataSource.cloneWithRowsAndSections(dataList)
    }
  }

  @autoBind
  onEndReached() {
    const { fetchMoreData, isComplete, isFetching, isRejected } = this.props.store
    if (!isComplete && !isFetching && !isRejected) fetchMoreData()
  }

  @autoBind
  async onRefresh() {
    if (this.state.refreshing) return
    this.setState({ refreshing: true })
    try {
      await this.props.store.fetchData()
    } finally {
      this.setState({ refreshing: false })
    }
  }

  getListViewDom(listView) {
    if (!listView) return
    if (/MicroMessenger/i.test(navigator.userAgent)) {
      const scrollView = findDOMNode(listView)
      let startY = 0
      scrollView.addEventListener('touchstart', (e) => {
        startY = e.changedTouches[0].pageY
      })
      scrollView.addEventListener('touchmove', (e) => {
        const endY = e.changedTouches[0].pageY
        const distanceY = endY - startY
        if (scrollView.scrollTop === 0 && distanceY > 0) {
          e.preventDefault()
        }
      })
    }
  }

  renderHeader = do {
    const { renderHeader } = this.props
    if (typeof renderHeader === 'function') renderHeader
    else if (renderHeader) () => renderHeader
    else null
  }

  @autoBind
  renderFooter() {
    return <ListFooter store={this.props.store}/>
  }

  render() {
    const { initialListSize = 10, renderRow, renderSectionHeader } = this.props

    return (
      <ListView
        ref={this.getListViewDom}
        className="custom-list"
        renderHeader={this.renderHeader}
        renderSectionHeader={renderSectionHeader}
        renderRow={renderRow}
        renderFooter={this.renderFooter}
        dataSource={this.dataSourceResult}
        initialListSize={this.isCollection ? initialListSize : void 0}
        pageSize={10}
        onEndReached={this.isCollection ? this.onEndReached : null}
        onEndReachedThreshold={200}
        pullToRefresh={
          this.isCollection ?
            <PullToRefresh
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
              distanceToRefresh={window.devicePixelRatio * 25}
            /> : null
        }
      />
    )
  }
}
