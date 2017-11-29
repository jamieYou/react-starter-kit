const environment = process.env.NODE_ENV

const environmentConfig = {
  "test": {
    apiHost: "https://cnodejs.org"
  },
  "development": {
    apiHost: location.origin
  },
  "staging": {
    apiHost: "https://cnodejs.org"
  },
  "production": {
    apiHost: "https://cnodejs.org"
  },
}

export const apiHost = environmentConfig[environment].apiHost
