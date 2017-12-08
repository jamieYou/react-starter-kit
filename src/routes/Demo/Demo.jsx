import React, { Component } from 'react'
import { observer, TopicsStore } from '@store'
import type { pageProps } from '@constants'
import { List, ActivityIndicator } from 'antd-mobile'
import { Link } from 'react-router-dom'
import './Demo.scss'

@observer
export default class Demo extends Component {
  props: pageProps

  topicsStore: TopicsStore = TopicsStore.findOrCreate(this.props.match.params.tab)

  componentDidMount() {
    if (!this.topicsStore.isFulfilled) return this.topicsStore.fetchTopics()
  }

  render() {
    return (
      <List
        className="demo"
        renderHeader={() => 'All Topics'}
        renderFooter={
          <ActivityIndicator
            text="正在加载" style={{ textAlign: 'center' }}
            animating={this.topicsStore.isFetching}
          />
        }
      >
        {
          this.topicsStore.data.map(topic =>
            <List.Item key={topic.id}>
              <Link to={{ pathname: `/topic/${topic.id}`, state: { modalKey: this.props.location.modalKey } }}>
                {topic.title}
              </Link>
            </List.Item>
          )
        }
      </List>
    )
  }
}
