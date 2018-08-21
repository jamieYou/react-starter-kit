import React, { Component, Fragment } from 'react'
import { findDOMNode } from 'react-dom'
import { withRouter } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroller'
import classnames from 'classnames'
import { PullToRefresh, WhiteSpace, Button } from 'antd-mobile'
import { autoBind } from '@utils'
import { routerStore } from '@store'
import type { location } from '@constants'

@withRouter
export default class ScrollView extends Component {
  static scrollTopList = new Map()

  static defaultProps = {
    useWindow: false,
  }

  props: {
    children: any,
    location: location,
    onRefresh: Function,
    onEndReached?: Function,
    id?: string,
    className?: string,
    useWindow: boolean,
  }

  scrollView: HTMLDivElement

  locationKey = this.props.id || this.props.location.key || 'root'

  style = {
    height: '100%',
    flex: 1,
    overflow: 'auto',
    transform: 'translateZ(0px)',
    WebkitOverflowScrolling: 'touch',
  }

  state = {
    refreshing: false,
    loading: false,
  }

  componentDidMount() {
    const scrollTop = this.constructor.scrollTopList.get(this.locationKey)
    if (scrollTop) this.props.useWindow ? window.scrollTo(0, scrollTop) : this.scrollView.scrollTop = scrollTop
  }

  componentWillUnmount() {
    const scrollTop = this.props.useWindow ? window.scrollY : this.scrollView.scrollTop
    if (routerStore.history.action === 'POP') this.constructor.scrollTopList.delete(this.locationKey)
    else this.constructor.scrollTopList.set(this.locationKey, scrollTop)
  }

  @autoBind
  getScrollViewDom(scrollView) {
    if (!scrollView) return
    this.scrollView = findDOMNode(scrollView)
  }

  @autoBind
  onRefresh() {
    if (this.state.refreshing) return
    this.setState({ refreshing: true })
    Promise.resolve(this.props.onRefresh()).finally(() =>
      this.setState({ refreshing: false })
    )
  }

  @autoBind
  async onEndReached() {
    if (this.state.loading) return
    this.setState({ loading: true })
    try {
      await this.props.onEndReached()
    } finally {
      this.setState({ loading: false })
    }
  }

  renderChildren() {
    const { loading } = this.state
    return (
      <Fragment>
        {this.props.children}
        {
          this.props.onEndReached && (
            <Fragment>
              <WhiteSpace/>
              <Button loading={loading} onClick={this.onEndReached}>
                {loading ? '加载中...' : '查看更多'}
              </Button>
              <WhiteSpace/>
            </Fragment>
          )
        }
      </Fragment>
    )
  }

  render() {
    const { onEndReached, onRefresh, className, useWindow } = this.props
    const scrollProps = {
      style: useWindow ? null : this.style,
      ref: this.getScrollViewDom,
      className: classnames('scroll-view'),
    }
    const content = (
      <InfiniteScroll
        className={className}
        pageStart={0}
        loadMore={this.onEndReached}
        hasMore={!!onEndReached}
        useWindow={useWindow}
        threshold={60}
        initialLoad={false}
      >
        {this.renderChildren()}
      </InfiniteScroll>
    )

    return do {
      if (onRefresh) {
        <PullToRefresh
          direction={'down'}
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
          {...scrollProps}
        >
          {content}
        </PullToRefresh>
      } else {
        <div {...scrollProps}>
          {content}
        </div>
      }
    }
  }
}
