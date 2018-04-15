import { Component } from 'react'
import { md } from "@utils"

export default class Title extends Component {
  props: {
    children?: any
  }

  static setTitle(title) {
    document.title = title
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

  componentWillMount() {
    this.constructor.setTitle(this.title)
  }

  get title() {
    return [].concat(this.props.children)[0] || 'c-node'
  }

  render() {
    return null
  }
}
