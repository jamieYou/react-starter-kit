import React, { Component } from 'react'
import PropTypes from 'prop-types'
import 'github-markdown-css'

export default class InnerHTML extends Component {
  static propTypes = {
    html: PropTypes.string.isRequired,
    className: PropTypes.string,
  }

  render() {
    const { className = '', html } = this.props
    return <div dangerouslySetInnerHTML={{ __html: html }} className={`markdown-body ${className}`}/>
  }
}
