import React, { Component } from 'react'
import { Tabs, Badge } from 'antd-mobile'

const tabs = [
  { title: <Badge text={'3'}>First Tab</Badge> },
  { title: <Badge text={'今日(20)'}>Second Tab</Badge> },
  { title: <Badge dot>Third Tab</Badge> },
]

export default class Detail extends Component {
  props: {
    location: {
      modalKey: string
    },
    history: Object
  }

  render() {
    return (
      <div>
        <Tabs
          tabs={tabs}
          initialPage={1}
          onChange={(tab, index) => this.props.history.replace({
            pathname: `/demo/${index}`,
            state: {
              modalKey: this.props.location.modalKey
            }
          })}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '150px',
            backgroundColor: '#fff'
          }}>
            Content of First Tab
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '150px',
            backgroundColor: '#fff'
          }}>
            Content of Second Tab
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '150px',
            backgroundColor: '#fff'
          }}>
            Content of Third Tab
          </div>
        </Tabs>
      </div>
    )
  }
}
