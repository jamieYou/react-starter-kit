import React, { Component } from 'react'
import type { htmlNode, location } from '@constants'

export default class ViewModal extends Component {
  props: {
    id: string,
    children: htmlNode,
    location: location,
    display: ?string,
  }

  shouldComponentUpdate(newProps) {
    return newProps.location !== this.props.location || newProps.display !== this.props.display
  }

  render() {
    const overflow = /(Android | wechatdevtools)/i.test(navigator.userAgent) ? 'auto' : void 0
    return (
      <div id={this.props.id} className="view-modal" style={{ display: this.props.display, overflow }}>
        {this.props.children}
      </div>
    )
  }
}
