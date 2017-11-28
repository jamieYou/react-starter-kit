import React from 'react'
import { BrowserRouter, Route, Redirect } from 'react-router-dom'
import App from './App/App'

export default (
  <BrowserRouter>
    <App>
      <Route exact path="/topics/:tab" component={require('./Demo/Demo').default}/>
      <Route path="/topic/:id" component={require('./Demo/Detail').default}/>
      <Redirect exact from="/" to="/topics/all"/>
      <Route component={() => <div>404</div>}/>
    </App>
  </BrowserRouter>
)
