import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import App from '../app'
import HomePage from './home-page'
import NotFoundPage from './not-found-page'

Route.defaultProps = {
  exact: true,
}

export default function Routes() {
  return (
    <BrowserRouter>
      <App>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route component={NotFoundPage} />
        </Switch>
      </App>
    </BrowserRouter>
  )
}
