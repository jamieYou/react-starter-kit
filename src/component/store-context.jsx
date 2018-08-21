import React, { Component } from 'react'
import { ActivityIndicator, Icon, Result } from 'antd-mobile'
import _ from 'lodash'
import { computed } from 'mobx'
import { observer } from 'mobx-react'
import type { WebAPIStore } from '@store'

@observer
export default class StoreContext extends Component {
  props: {
    children: any,
    store: WebAPIStore | Array<WebAPIStore>,
    errHandle: Function
  }

  stores = [].concat(this.props.store)

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
    return do {
      if (this.isFulfilled) {
        this.props.children
      } else if (this.isRejected) {
        <div className="store-context">
          <Result
            img={
              <Icon
                type="cross-circle-o"
                className="spe"
                style={{
                  fill: '#F13642',
                  width: 50,
                  height: 50,
                }}
              />
            }
            title="请求失败"
            message={this.errMsg}
            buttonText="重新加载"
            buttonType="warning"
            onButtonClick={this.props.errHandle}
          />
        </div>
      } else {
        <ActivityIndicator animating size="large" text="加载中" toast/>
      }
    }
  }
}
