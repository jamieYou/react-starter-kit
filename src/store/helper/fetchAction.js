import StoreHelper from './StoreHelper'
import { action } from 'MobX'

function fetchActionDecorator({ bound = false } = {}) {
  return function (target, name, descriptor) {
    const oldAction = descriptor.value
    if (typeof oldAction !== 'function') {
      throw new Error(`${name} is not a function`)
    }

    descriptor.value = async function result() {
      const self: StoreHelper = this
      try {
        self.setPendingState(name)
        const res = await oldAction.apply(self, arguments)
        return self.setFulfilledState(res, name)
      } catch (err) {
        throw  self.setRejectedState(err, name)
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
