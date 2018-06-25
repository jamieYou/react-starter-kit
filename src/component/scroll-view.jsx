import React, { Component, Fragment } from 'react'
import { findDOMNode } from 'react-dom'
import { withRouter } from 'react-router-dom'
import { PullToRefresh, WhiteSpace, Button } from 'antd-mobile'
import { autoBind } from '@utils'
import type { location } from '@constants'

@withRouter
export default class ScrollView extends Component {
  static scrollTopList = new Map()

  props: {
    children: any,
    location: location,
    onRefresh: Function,
    onEndReached?: Function,
    id?: string,
  }

  scrollView: HTMLDivElement

  locationKey = this.props.id || this.props.location.key || 'root'

  scrollTop = 0

  style = {
    height: '100%',
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
    scrollTop && (this.scrollView.scrollTop = scrollTop)
  }

  componentWillUnmount() {
    this.constructor.scrollTopList.set(this.locationKey, this.scrollView.scrollTop)
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
    Promise.resolve(this.props.onEndReached()).finally(() =>
      this.setState({ loading: false })
    )
  }

  @autoBind
  onScroll(event) {
    const { scrollHeight, clientHeight, scrollTop } = event.target
    const distanceY = scrollTop - this.scrollTop
    this.scrollTop = scrollTop
    const isBottom = clientHeight + scrollTop >= scrollHeight - 60
    if (isBottom && distanceY > 0) this.onEndReached()
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
    const { onEndReached, onRefresh } = this.props
    const scrollProps = {
      style: this.style,
      ref: this.getScrollViewDom,
      onScroll: onEndReached ? this.onScroll : null,
    }
    return do {
      if (onRefresh) {
        <PullToRefresh
          direction={'down'}
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
          {...scrollProps}
        >
          {this.renderChildren()}
        </PullToRefresh>
      } else {
        <div {...scrollProps}>
          {this.renderChildren()}
        </div>
      }
    }
  }
}
