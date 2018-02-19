const _ = require('lodash')

const antdMobile = [
  'Button', 'List', 'ActivityIndicator', 'Toast', 'Result',
  'ListView', 'PullToRefresh', 'Icon', 'Modal',
]

const vendor = [
  'react', 'react-dom', 'prop-types', 'mobx', 'mobx-react', 'qs', 'react-router-dom',
  'isomorphic-fetch', 'mobile-detect', 'fastclick', 'github-markdown-css',
]

antdMobile.forEach(component =>
  vendor.push(`antd-mobile/lib/${_.kebabCase(component)}/index.js`, `antd-mobile/lib/${_.kebabCase(component)}/style`)
)

exports.vendor = vendor
