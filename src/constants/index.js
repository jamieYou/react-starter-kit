import type { Component } from 'react'

export * from "./environment"

type htmlType = string | number | Component | null | boolean
export type htmlNode = htmlType | Array<htmlType>

export type location = {
  hash: string,
  key: string,
  pathname: string,
  search: string,
  state?: Object,
}

export type history = {
  go: Function,
  push: Function,
  goBack: Function,
  replace: Function,
  location: location,
  action: "PUSH" | "POP" | "REPLACE",
}

export type match = {
  isExact: boolean,
  params: {},
  path: string,
  url: string
}

export type pageProps = {
  location: location,
  history: history,
  match: match,
  parameters: {},
}

export interface SpriteSymbol {
  id: string;
  content: string;
  viewBox: string;
}
