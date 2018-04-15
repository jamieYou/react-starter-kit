import React, { Component } from 'react'
import { Icon, Result } from 'antd-mobile'
import './index.less'

export default class NotFoundPage extends Component {
  render() {
    return (
      <div className="not-found-page">
        <Result
          img={<Icon type="cross-circle-o" color="#F13642"/>}
          title="404"
          message="页面不存在"
        />
      </div>
    )
  }
}
