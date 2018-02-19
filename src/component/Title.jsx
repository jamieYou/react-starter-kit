import { Component } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { md } from '@utils'
import type { location } from '@constants'

@withRouter
export default class Title extends Component {
  static contextTypes = {
    onReshow: PropTypes.func
  }

  props: {
    location: location,
    value: string | number | null
  }

  componentWillMount() {
    const { location } = this.props
    this.setTitle()
    this.context.onReshow(location.key, this::this.setTitle)
  }

  setTitle() {
    const { value = 'A100' } = this.props
    document.title = value
    if (md.is('iPhone')) {
      const iframe: HTMLIFrameElement = document.createElement("iframe")
      iframe.style.display = "none"
      iframe.setAttribute("src", "about:blank")
      const onLoad = () => {
        setTimeout(() => {
          iframe.removeEventListener('load', onLoad)
          document.body.removeChild(iframe)
        }, 0)
      }
      iframe.addEventListener('load', onLoad)
      document.body.appendChild(iframe)
    }
  }

  render() {
    return null
  }
}
