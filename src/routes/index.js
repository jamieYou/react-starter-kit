import React from 'react'
import { BrowserRouter, Route, Redirect } from 'react-router-dom'
import App from './App/App'
import * as Topic from './Topic'

export default function Routes() {
  return (
    <BrowserRouter>
      <App>
        <Route exact path="/topics" component={Topic.TopicsPage}/>
        <Route exact path="/topics/:id" component={Topic.TopicPage}/>
        <Redirect exact from="/" to="/topics"/>
        <Route component={() => <div>404</div>}/>
      </App>
    </BrowserRouter>
  )
}
