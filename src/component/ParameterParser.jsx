import React, { Component } from 'react'
import type { pageProps } from '@constants'
import qs from 'qs'

export function paramsParser(Page: Component<pageProps>) {
  return function ParamsParserContainer(props: pageProps) {
    const { location, match } = props
    const query = qs.parse(location.search.replace(/^\?/, ''))
    const params = Object.assign({}, query, match.params)
    return <Page {...props} params={params}/>
  }
}
