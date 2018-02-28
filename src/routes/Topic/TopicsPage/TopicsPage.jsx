import React, { Component } from 'react'
import { Card } from 'antd-mobile'
import { Link } from 'react-router-dom'
import { StoreContext, CustomList, Title } from '@component'
import { TopicsStore, observer } from '@store'
import type { Topic } from '@model'
import './TopicsPage.less'

@observer
export default class TopicsPage extends Component {
  topicsStore = TopicsStore.findOrCreate('all')

  renderRow(rowData: Topic) {
    return (
      <Link to={`/topics/${rowData.id}`}>
        <Card full className="topic-card">
          <Card.Header
            title={<span>{rowData.title}</span>}
            thumb={rowData.author.avatar_url}
          />
          <Card.Footer
            content={`${rowData.reply_count}条回复 / ${rowData.visit_count}次查看`}
            extra={<div>{rowData.last_reply_at.split('T')[0]}</div>}
          />
        </Card>
      </Link>
    )
  }

  render() {
    return (
      <StoreContext store={this.topicsStore} className="topics-page">
        <Title value="全部主题"/>
        <CustomList store={this.topicsStore} renderRow={this.renderRow} renderHeader="全部主题"/>
      </StoreContext>
    )
  }
}
