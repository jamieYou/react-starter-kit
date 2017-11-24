import 'babel-polyfill'
import { render } from 'react-dom'
import routes from './routes'
import { mobileHack } from '@utils'

require('./favicon.ico')

mobileHack()

if (process.env.NODE_ENV !== 'production') {
  const { enableLogging } = require('mobx-logger')
  enableLogging({
    action: true
  })
}

render(
  routes,
  document.querySelector('#app'),
)
