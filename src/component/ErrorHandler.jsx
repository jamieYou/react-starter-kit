import { Component } from 'react'
import { htmlNode } from '@constants'

export default class ErrorHandler extends Component {
  props: {
    children: htmlNode,
    onError?: Error => void,
  }

  componentDidCatch(error) {
    const { onError } = this.props
    if (onError) return onError(error)
    setTimeout(() => {
      throw error
    }, 0)
    throw error
  }

  render() {
    return this.props.children
  }
}
