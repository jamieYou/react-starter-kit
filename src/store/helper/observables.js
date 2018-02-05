import _ from 'lodash'
import { observable } from 'mobx'

export function observables(properties, shallowList) {
  return target => {
    const { prototype } = target
    _.forEach(properties, (value, key) => {
      const result = observable(prototype, key, { initializer: () => value })
      Object.defineProperty(prototype, key, result)
    })
    _.forEach(shallowList, (value, key) => {
      const result = observable.shallow(prototype, key, { initializer: () => value })
      Object.defineProperty(prototype, key, result)
    })
    return target
  }
}
