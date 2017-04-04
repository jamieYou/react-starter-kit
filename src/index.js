import 'babel-polyfill'
import { render } from 'react-dom'
import routes from './routes'

require('./favicon.ico')

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
