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
  const { hot } = require('react-hot-loader')
  const Root = hot(module)(Routes)
  ReactDOM.render(
    <Root/>,
    document.querySelector('#app'),
  )
} else {
  const { ErrorHandler } = require('@component')
  ReactDOM.render(
    <ErrorHandler>
      <Routes/>
    </ErrorHandler>,
    document.querySelector('#app'),
  )
}
