import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { ListView, PullToRefresh, ActivityIndicator } from 'antd-mobile'
import type { IObservableArray } from '@store/helper'
import { observer, computed, Collection, WebAPIStore, Observer } from '@store'
import { autoBind, md } from '@utils'
import './index.less'

@observer
export default class CustomList extends Component {
  props: {
    renderRow: (rowData: Object, sectionID: string, rowID: string, highlightRow: (sectionID: string, rowID: string) => void) => any,
    store: Collection | WebAPIStore,
    initialListSize?: number,
    renderHeader?: Function | string,
    renderSectionHeader?: Function,
    dataList?: IObservableArray | Object<Array>,
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
    this.props.store.fetchData().finally(() => this.setState({ refreshing: false }))
  }

  @autoBind
  onRejected() {
    if (this.isCollection) {
      this.props.store.fetchMoreData()
    } else {
      this.props.store.fetchData()
    }
  }

  getListViewDom(listView) {
    if (!listView) return
    if (md.match('MicroMessenger')) {
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

  @autoBind
  renderHeader() {
    const { renderHeader } = this.props
    if (typeof renderHeader === 'function') {
      return <Observer render={renderHeader}/>
    }
    else return renderHeader
  }

  @autoBind
  renderListRow(rowData, sectionID, rowID, highlightRow) {
    return this.props.renderRow(rowData, sectionID, rowID, highlightRow)
  }

  @autoBind
  renderRow(...args) {
    return <Observer render={() => this.props.renderRow(...args)}/>
  }

  @autoBind
  renderListFooter() {
    const { store } = this.props
    const { isFetching, isRejected, isComplete, isFulfilled } = store
    if (this.isCollection ? isComplete : isFulfilled) return <div>没有更多了</div>
    if (isFetching) return <ActivityIndicator text="加载中..."/>
    if (isRejected) return <span onClick={this.onRejected}>重新加载</span>
    return null
  }

  @autoBind
  renderFooter() {
    return <Observer render={this.renderListFooter}/>
  }

  render() {
    const { initialListSize = 10, renderSectionHeader, renderHeader } = this.props

    return (
      <ListView
        ref={this.getListViewDom}
        className="custom-list"
        renderHeader={renderHeader ? this.renderHeader : null}
        renderSectionHeader={renderSectionHeader}
        renderRow={this.renderRow}
        renderFooter={this.renderFooter}
        dataSource={this.dataSourceResult}
        initialListSize={initialListSize}
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
