import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { ListView, ActivityIndicator, PullToRefresh } from 'antd-mobile'
import type { IObservableArray } from 'MobX'
import { observer, computed } from '@store'
import { autoBind } from '@utils'
import './CustomList.scss'

@observer
export default class CustomList extends Component {
  props: {
    dataList: IObservableArray,
    renderRow: Function,
    renderHeader?: Function,
    isFetching: boolean,
    isRejected: boolean,
    complete: boolean,
    fetchData: () => Promise,
    fetchMoreData?: () => Promise,
  }

  listView: ListView

  dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
  })

  state = {
    refreshing: false
  }

  componentDidMount() {
    if (/MicroMessenger/i.test(navigator.userAgent)) {
      const scrollView = findDOMNode(this.listView)
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

  @computed
  get dataSourceResult() {
    return this.dataSource.cloneWithRows(this.props.dataList.slice())
  }

  @autoBind
  handleReFetch(e) {
    e.preventDefault()
    this.props.fetchData()
  }

  @autoBind
  onEndReached() {
    const { fetchMoreData, complete, isFetching, isRejected } = this.props
    if (!complete && !isFetching && !isRejected) {
      fetchMoreData()
    }
  }

  @autoBind
  async onRefresh() {
    if (this.state.refreshing) return
    this.setState({ refreshing: true })
    await this.props.fetchData()
    this.setState({ refreshing: false })
  }

  @autoBind
  renderFooter() {
    const { isFetching, isRejected, complete } = this.props
    if (complete) return <div>没有更多了</div>
    if (isFetching) return <ActivityIndicator text="加载中..."/>
    if (isRejected) return <a href="#" onClick={this.handleReFetch}>重新加载</a>
  }

  render() {
    return (
      <ListView
        ref={r => this.listView = r}
        className="custom-list"
        renderRow={this.props.renderRow}
        renderHeader={this.props.renderHeader}
        renderFooter={this.renderFooter}
        dataSource={this.dataSourceResult}
        initialListSize={10}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={200}
        pullToRefresh={<PullToRefresh
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
          distanceToRefresh={window.devicePixelRatio * 25}
        />}
      />
    )
  }
}
