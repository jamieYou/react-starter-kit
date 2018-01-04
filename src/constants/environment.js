const environment = process.env.NODE_ENV

const environmentConfig = {
  "test": {
    apiHost: "https://cnodejs.org"
  },
  "development": {
    apiHost: location.origin
  },
  "staging": {
    apiHost: location.origin
  },
  "production": {
    apiHost: location.origin
  },
}

export const apiHost = environmentConfig[environment].apiHost
