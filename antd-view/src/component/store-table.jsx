import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, computed, routerStore, action, Collection } from '@store'

@observer
export default class StoreTable extends Component {
  static defaultProps = {
    relevanceRouter: true,
  }

  static propTypes = {
    collection: PropTypes.instanceOf(Collection),
    children: PropTypes.element.isRequired,
    relevanceRouter: PropTypes.bool,
  }

  @computed
  get pagination() {
    const { meta: { total }, params } = this.props.collection
    return {
      total,
      current: params.page,
      pageSize: params.per_page,
      showSizeChanger: true,
      showQuickJumper: true,
    }
  }

  @action.bound
  onChange(pagination) {
    const { relevanceRouter, collection } = this.props
    const { current: page, pageSize: per_page } = pagination
    if (relevanceRouter) {
      routerStore.assignQuery({ page, per_page })
    } else {
      collection.params.page = page
      collection.params.per_page = per_page
      collection.resetData()
      collection.fetchData()
    }
  }

  render() {
    const { onChange, pagination } = this
    const { collection } = this.props
    return React.cloneElement(this.props.children, {
      pagination, onChange,
      loading: collection.loading,
      dataSource: collection.dataSource,
    })
  }
}
