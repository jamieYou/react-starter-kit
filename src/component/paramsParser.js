import React, { Component } from 'react'
import type { pageProps } from '@constants'
import qs from 'qs'

export default function paramsParser(Page: Component<pageProps>) {
  return function ParamsParser(props: pageProps) {
    const { location, match } = props
    const query = qs.parse(location.search.replace(/^\?/, ''))
    const params = Object.assign({}, query, match.params, location.state)
    return <Page key={location.key || 'root'} {...props} params={params}/>
  }
}
