import React, { Component } from 'react'
import { routerStore } from '@store'
import type { pageProps } from '@constants'

export default function withPage(pageKey?: string) {
  return function (Page: Component<pageProps>) {
    return function PageWrapper(props: pageProps) {
      const { location, match } = props
      const params = Object.assign({}, routerStore.query, match.params, location.state, { _key: location.key })
      return <Page key={params[pageKey]} {...props} params={params}/>
    }
  }
}
