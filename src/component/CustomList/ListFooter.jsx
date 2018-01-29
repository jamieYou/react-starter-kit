import React, { Component } from 'react'
import { ActivityIndicator } from 'antd-mobile'
import { observer } from 'mobx-react'
import { Collection, StoreHelper } from '@store'
import { autoBind } from '@utils'

@observer
export default class ListFooter extends Component {
  props: {
    store: Collection | StoreHelper,
  }

  isCollection = this.props.store instanceof Collection

  @autoBind
  onRejected(e) {
    e.preventDefault()
    if (this.isCollection) {
      this.props.store.fetchMoreData()
    } else {
      this.props.store.fetchData()
    }
  }

  render() {
    const { isFetching, isRejected, isComplete, isFulfilled } = this.props.store
    if (this.isCollection ? isComplete : isFulfilled) return <div>没有更多了</div>
    if (isFetching) return <ActivityIndicator text="加载中..."/>
    if (isRejected) return <a href="#" onClick={this.onRejected}>重新加载</a>
    return null
  }
}
