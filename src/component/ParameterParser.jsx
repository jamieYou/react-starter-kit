import React, { Component } from 'react'
import type { pageProps } from '@constants'
import qs from 'qs'

export function parameterParser(Page: Component<pageProps>) {
  return function ParameterParserContainer(props: pageProps) {
    const { location, match } = props
    const query = qs.parse(location.search.replace(/^\?/, ''))
    const parameters = Object.assign({}, query, match.params)
    return <Page {...props} parameters={parameters}/>
  }
}
