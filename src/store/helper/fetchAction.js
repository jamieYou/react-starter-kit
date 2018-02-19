import type { WebAPIStore } from './WebAPIStore'
import { action } from 'mobx'

function fetchActionDecorator({ bound = false } = {}) {
  return function (target, name, descriptor) {
    const oldAction = descriptor.value
    if (typeof oldAction !== 'function') {
      throw new Error(`${name} is not a function`)
    }

    descriptor.value = async function result() {
      const self: WebAPIStore = this
      if (self.isFetching) return this.listenFetchAction()
      try {
        self.setPendingState(name)
        const res = await oldAction.apply(self, arguments)
        self.setFulfilledState(res, name)
      } catch (err) {
        self.setRejectedState(err, name)
        throw err
      }
    }

    return bound ? action.bound(target, name, descriptor) : action(target, name, descriptor)
  }
}

export default function fetchAction(...args) {
  if (args.length === 3) {
    return fetchActionDecorator()(...args)
  } else {
    return fetchActionDecorator(...args)
  }
}

fetchAction.bound = function (...args) {
  return fetchActionDecorator({ bound: true })(...args)
}
