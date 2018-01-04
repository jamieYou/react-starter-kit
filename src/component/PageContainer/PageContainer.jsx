import React, { Component } from 'react'
import { ActivityIndicator, Icon } from 'antd-mobile'
import type { htmlNode } from '@constants'
import './PageContainer.scss'

export default class PageContainer extends Component {
  props: {
    children?: htmlNode,
    className: string,
    storeInfo: {
      isFetching: boolean,
      isRejected: boolean,
      isFulfilled: boolean,
      reloadAction: Function,
    }
  }

  render() {
    const { storeInfo: { isFulfilled, isFetching, isRejected, reloadAction }, className } = this.props

    return (
      <div className={`page-container ${className}`}>
        {
          do {
            if (isFulfilled) {
              this.props.children
            } else {
              <div className="page-status">
                {
                  do {
                    if (isFetching) {
                      <ActivityIndicator animating size="large" text="Loading..."/>
                    } else if (isRejected) {
                      <div className="reload-view">
                        <Icon type="cross-circle-o" className="spe"/>
                        <div className="reload-text">似乎出了点问题</div>
                        <div className="reload-btn" onClick={reloadAction}>重新加载</div>
                      </div>
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
