import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { ListView, PullToRefresh, ActivityIndicator } from 'antd-mobile'
import type { IObservableArray } from '@store/helper'
import type { htmlNode } from '@constants'
import { observer, computed, Collection, WebAPIStore } from '@store'
import { autoBind } from '@utils'
import './CustomList.less'

@observer
export default class CustomList extends Component {
  static ListHeader = observer(function ListHeader({ render }) {
    return render()
  })

  static ListRow = observer(function ListRow({ rowData, sectionID, rowID, highlightRow, render }) {
    return render(rowData, sectionID, rowID, highlightRow)
  })

  static ListFooter = observer(function ListFooter({ store, onRejected }: { store: Collection | WebAPIStore, onRejected: Function }): htmlNode {
    const isCollection = store instanceof Collection
    const { isFetching, isRejected, isComplete, isFulfilled } = store
    if (isCollection ? isComplete : isFulfilled) return <div>没有更多了</div>
    if (isFetching) return <ActivityIndicator text="加载中..."/>
    if (isRejected) return <span onClick={onRejected}>重新加载</span>
    return null
  })

  props: {
    dataList?: IObservableArray | Object<Array>,
    renderRow: (rowData: Object, sectionID: string, rowID: string, highlightRow: (sectionID: string, rowID: string) => void) => htmlNode,
    store: Collection | WebAPIStore,
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

  @autoBind
  renderHeader() {
    const { renderHeader } = this.props
    if (typeof renderHeader === 'function') {
      const { ListHeader } = this.constructor
      return <ListHeader render={renderHeader}/>
    }
    else return renderHeader
  }

  @autoBind
  renderRow(rowData, sectionID, rowID, highlightRow) {
    const { ListRow } = this.constructor
    const { renderRow: render } = this.props
    return <ListRow {...{ rowData, sectionID, rowID, highlightRow, render }}/>
  }

  @autoBind
  renderFooter() {
    const { ListFooter } = this.constructor
    return <ListFooter store={this.props.store} onRejected={this.onRejected}/>
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
