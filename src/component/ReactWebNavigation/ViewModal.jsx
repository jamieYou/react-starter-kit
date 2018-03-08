import React, { Component } from 'react'
import type { location } from '@constants'
import { md } from '@utils'

export default class ViewModal extends Component {
  props: {
    id: string,
    children: any,
    location: location,
    display: ?string,
  }

  shouldComponentUpdate(newProps) {
    return newProps.location !== this.props.location || newProps.display !== this.props.display
  }

  render() {
    const overflow = md.match(/(Android | wechatdevtools)/i) ? 'auto' : void 0
    return (
      <div id={this.props.id} className="view-modal" style={{ display: this.props.display, overflow }}>
        {this.props.children}
      </div>
    )
  }
}
