import 'babel-polyfill'
import 'core-js/modules/es7.promise.finally'
import React from 'react'
import ReactDOM from 'react-dom'
import Routes from './routes'

if (process.env.NODE_ENV !== 'production') {
  const { enableLogging } = require('mobx-logger')
  enableLogging({
    action: true
  })
}

if (process.env.NODE_ENV === 'development') {
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
  ReactDOM.render(<Routes/>, document.querySelector('#app'))
}
