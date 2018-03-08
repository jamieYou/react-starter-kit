import React, { Component } from 'react'
import { Button } from 'antd-mobile'
import _ from 'lodash'
import { withRouter } from 'react-router'
import type { history } from '@constants'
import { autoBind } from '@utils'

@withRouter
export default class LinkButton extends Component {
  props: {
    children: any,
    to: string,
    history: history,
  }

  @autoBind
  handleClick() {
    const { to, history } = this.props
    to && history.push(to)
  }

  render() {
    const props = _.omit(this.props, 'history', 'location', 'match', 'to', 'staticContext')
    return <Button onClick={this.handleClick} {...props}/>
  }
}
