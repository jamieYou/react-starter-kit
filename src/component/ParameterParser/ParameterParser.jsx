import React, { Component } from 'react'
import type { pageProps } from '@constants'
import qs from 'qs'

export function parameterParser(Page: Component) {
  return function ParameterParser(props: pageProps) {
    const { location, match } = props
    const query = qs.parse(location.search.replace(/^\?/, ''))
    const parameter = Object.assign({}, query, match.params)
    return <Page {...props} parameter={parameter}/>
  }
}
