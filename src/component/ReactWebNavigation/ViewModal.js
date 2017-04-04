import React, { Component } from 'react'
import type { htmlNode } from '@constants'

export default class ViewModal extends Component {
  props: {
    id: string,
    children: htmlNode,
    location: Object,
    display: string | null,
  }

  shouldComponentUpdate(newProps) {
    return newProps.location !== this.props.location || newProps.display !== this.props.display
  }

  render() {
    return (
      <div id={this.props.id} className="view-modal" style={{ display: this.props.display }}>
        {this.props.children}
      </div>
    )
  }
}
