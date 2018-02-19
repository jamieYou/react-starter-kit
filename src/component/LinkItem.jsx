import React, { Component } from 'react'
import { List } from 'antd-mobile'
import { withRouter } from 'react-router'
import _ from 'lodash'
import type { htmlNode, history } from '@constants'
import { autoBind } from '@utils'

@withRouter
export default class LinkItem extends Component {
  props: {
    children: htmlNode,
    to: string,
    history: history,
  }

  static Brief = List.Item.Brief

  @autoBind
  handleClick() {
    const { to, history } = this.props
    to && history.push(to)
  }

  render() {
    const props = _.omit(this.props, 'history', 'location', 'match', 'to', 'staticContext')
    return <List.Item onClick={this.handleClick} {...props}/>
  }
}
