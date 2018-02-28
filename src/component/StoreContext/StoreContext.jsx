import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ActivityIndicator, Icon, Result } from 'antd-mobile'
import _ from 'lodash'
import { computed } from 'mobx'
import { observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import type { htmlNode, location } from '@constants'
import type { WebAPIStore } from '@store'
import { autoBind } from '@utils'
import './StoreContext.less'

@withRouter
@observer
export default class StoreContext extends Component {
  static contextTypes = {
    onReshow: PropTypes.func
  }

  props: {
    location: location,
    children: htmlNode,
    className?: string,
    store: WebAPIStore | Array<WebAPIStore>,
    onLoad?: Function,
    onReshow?: Function,
  }

  context: {
    onReshow: (key: string, func: Function) => void
  }

  stores = [].concat(this.props.store)

  componentWillMount() {
    const { props: { location, onReshow } } = this
    onReshow && this.context.onReshow(location.key, onReshow)
    this.fetchAction()
  }

  @autoBind
  fetchAction() {
    const { onLoad } = this.props
    if (onLoad) return onLoad()
    return Promise.all(this.stores.map(item => item.fetchData()))
  }

  @computed
  get isFetching() {
    return !!this.stores.find(item => item.isFetching)
  }

  @computed
  get isFulfilled() {
    return this.stores.reduce((pre, item) => pre && item.isFulfilled, true)
  }

  @computed
  get isRejected() {
    return !!this.stores.find(item => item.isRejected)
  }

  @computed
  get errMsg() {
    const store: ?WebAPIStore = this.stores.find(item => item.isRejected)
    return _.get(store, 'error.message', '似乎出了点问题')
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
