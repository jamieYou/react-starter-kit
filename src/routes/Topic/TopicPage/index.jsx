import React, { Component } from 'react'
import { Card } from 'antd-mobile'
import { StoreContext, CustomList, paramsParser, Title, InnerHTML } from '@component'
import { TopicStore, observer } from '@store'
import { autoBind } from '@utils'
import type { Reply } from '@model'
import './index.less'

@paramsParser
@observer
export default class TopicPage extends Component {
  props: {
    params: {
      id: string
    }
  }

  topicStore: TopicStore = TopicStore.findOrCreate(this.props.params.id)

  @autoBind
  renderHeader() {
    const { title, author, content } = this.topicStore
    return (
      <Card full className="topic-card">
        <Card.Header
          title={<span>{title}</span>}
          thumb={author.avatar_url}
        />
        <Card.Body>
          <InnerHTML html={content}/>
        </Card.Body>
      </Card>
    )
  }

  renderRow(rowData: Reply, sectionID, rowID) {
    return (
      <Card full className="reply-card">
        <Card.Header
          title={<span>{+rowID + 1}楼•{rowData.create_at.split('T')[0]}</span>}
          thumb={rowData.author.avatar_url}
        />
        <Card.Body>
          <InnerHTML html={rowData.content}/>
        </Card.Body>
      </Card>
    )
  }

  render() {
    return (
      <StoreContext store={this.topicStore} className="topic-page">
        <Title value={this.topicStore.title}/>
        <CustomList
          store={this.topicStore}
          renderHeader={this.renderHeader}
          renderRow={this.renderRow}
          dataList={this.topicStore.replies}
        />
      </StoreContext>
    )
  }
}
