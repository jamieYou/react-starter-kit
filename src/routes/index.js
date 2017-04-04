import React from 'react'
import { BrowserRouter, Route, Redirect } from 'react-router-dom'
import App from './App/App'

export default (
  <BrowserRouter>
    <App>
      <Route exact path="/demo" component={require('./Demo/Demo').default}/>
      <Route path="/demo/:id" component={require('./Demo/Detail').default}/>
      <Redirect from="/" to="/demo"/>
      <Route component={() => <div>404</div>}/>
    </App>
  </BrowserRouter>
)
