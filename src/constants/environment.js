const environment = process.env.BROWSER_ENV

const environmentConfig = {
  "test": {
    apiHost: location.host
  },
  "development": {
    apiHost: location.host
  },
  "staging": {
    apiHost: location.host
  },
  "production": {
    apiHost: location.host
  },
}

export const { apiHost } = environmentConfig[environment]
export const apiOrigin = `${location.protocol}//${apiHost}`
