import React, { Component } from 'react'
import _ from "lodash"
import { decoder } from '@utils'
import { routerStore } from '@store'
import type { pageProps } from '@constants'

export default function paramParser(pageKey?: string) {
  return function (Page: Component<pageProps>) {
    return function Parser(props: pageProps) {
      const { location, match } = props
      const params = _.mapValues(match.params, decoder)
      Object.assign(params, routerStore.query, location.state, { _key: location.key })
      return <Page key={params[pageKey]} {...props} params={params}/>
    }
  }
}
