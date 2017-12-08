import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import Routes from './routes'
import { mobileHack } from '@utils'
import { AppContainer } from 'react-hot-loader'

mobileHack()

if (process.env.NODE_ENV !== 'production') {
  const { enableLogging } = require('mobx-logger')
  enableLogging({
    action: true
  })
}

function render(Component) {
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
