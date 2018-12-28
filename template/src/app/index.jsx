import { Component } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { routerStore, authStore } from '@store'
import './index.less'

@withRouter
export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
  }

  state = {
    appLoading: true,
  }

  componentWillMount() {
    routerStore.setRouter(this.props)
    authStore.fetchData().finally(() => this.setState({ appLoading: false }))
  }

  componentWillReceiveProps(newProps) {
    routerStore.setRouter(newProps)
  }

  render() {
    return this.props.children
  }
}
