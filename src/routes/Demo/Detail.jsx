import React, { Component } from 'react'
import { Button } from 'antd-mobile'
import type { pageProps } from '@constants'

export default class Detail extends Component {
  props: pageProps

  render() {
    return (
      <div>
        <Button onClick={this.props.history.goBack}>返回</Button>
      </div>
    )
  }
}
