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
  const render = Component => {
    ReactDOM.render(
      <AppContainer warnings={false}>
        <Component/>
      </AppContainer>,
      document.querySelector('#app'),
    )
  }

  render(Routes)

  if (module.hot) {
    module.hot.accept('./routes', () => {
      render(Routes)
    })
  }
}

if (!process.env.__DEV__) {
  ReactDOM.render(
    <Routes/>,
    document.querySelector('#app'),
  )
}
