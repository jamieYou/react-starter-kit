import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import App from '../layout/App'
import HomePage from './HomePage'
import NotFoundPage from './NotFoundPage'

export default function Routes() {
  return (
    <BrowserRouter>
      <App>
        <Switch>
          <Route path="/" component={HomePage}/>
          <Route component={NotFoundPage}/>
        </Switch>
      </App>
    </BrowserRouter>
  )
}
