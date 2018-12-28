import React, { Component } from 'react'
import { Result } from '@component'

export default class NotFoundPage extends Component {
  render() {
    return (
      <div className="not-found-page page">
        <Result
          type="error"
          title="404"
          description="页面不存在"
        />
      </div>
    )
  }
}
