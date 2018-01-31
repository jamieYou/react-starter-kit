import React, { Component } from 'react'
import { ActivityIndicator, Icon, Result } from 'antd-mobile'
import _ from 'lodash'
import { computed } from 'mobx'
import { observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import type { htmlNode, location } from '@constants'
import type { StoreHelper } from '@store'
import { LocationEvent, autoBind } from '@utils'
import './StoreContext.less'

@withRouter
@observer
export default class StoreContext extends Component {
  props: {
    location: location,
    children: htmlNode,
    className?: string,
    store: StoreHelper | Array<StoreHelper>,
    loadAction?: Function,
    onReshow?: Function,
  }

  statusFilter = [401, 403, 404]

  locationEvent: LocationEvent | null = do {
    const { props: { location, onReshow } } = this
    if (onReshow) {
      const result = LocationEvent.find(location.key)
      result.onReshow = onReshow
      result
    } else {
      null
    }
  }

  componentWillMount() {
    this.fetchAction()
  }

  @autoBind
  fetchAction() {
    const { loadAction, store } = this.props
    if (loadAction) return loadAction()
    return Promise.all([].concat(store).map(item => item.fetchData()))
  }

  @computed
  get isFetching() {
    return !![].concat(this.props.store).find(item => item.isFetching)
  }

  @computed
  get isFulfilled() {
    return [].concat(this.props.store).reduce((pre, item) => pre && item.isFulfilled, true)
  }

  @computed
  get isRejected() {
    return !![].concat(this.props.store).find(item => item.isRejected)
  }

  @computed
  get errMsg() {
    const store: ?StoreHelper =
      [].concat(this.props.store).find(item => this.statusFilter.includes(_.get(item.error, 'status')))
    if (store) return store.error.message
    return '似乎出了点问题'
  }

  render() {
    const { className = '' } = this.props

    return (
      <div className={`store-context ${className}`}>
        {
          do {
            if (this.isFulfilled) {
              this.props.children
            } else {
              <div className="store-status">
                {
                  do {
                    if (this.isFetching) {
                      <ActivityIndicator animating size="large" text="Loading..."/>
                    } else if (this.isRejected) {
                      <Result
                        img={<Icon type="cross-circle-o" className="spe"/>}
                        title="请求失败"
                        message={this.errMsg}
                        buttonText="重新加载"
                        buttonType="warning"
                        onButtonClick={this.fetchAction}
                      />
                    }
                  }
                }
              </div>
            }
          }
        }
      </div>
    )
  }
}
