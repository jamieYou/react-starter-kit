import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { mobileHack } from '@utils'
import Routes from './routes'

mobileHack()

if (process.env.NODE_ENV !== 'production') {
  const { enableLogging } = require('mobx-logger')
  enableLogging({
    action: true
  })
}

if (process.env.__DEV__) {
  const { AppContainer } = require('react-hot-loader')
  const render = () => {
    ReactDOM.render(
      <AppContainer warnings={false}>
        <Routes/>
      </AppContainer>,
      document.querySelector('#app'),
    )
  }
  render()
  if (module.hot) module.hot.accept('./routes', render)
} else {
  const { ErrorHandler } = require('@component')
  ReactDOM.render(
    <ErrorHandler>
      <Routes/>
    </ErrorHandler>,
    document.querySelector('#app'),
  )
}
