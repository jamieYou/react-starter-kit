export * from './env'

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
  params: {},
}
