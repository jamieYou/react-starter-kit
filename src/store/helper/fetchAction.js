import { action } from 'mobx'
import type { WebAPIStore } from "./WebAPIStore"
import generatorRun from './generatorRun'
import toast from "@component/toast"

function fetchActionDecorator(target, name, descriptor, { bound = false } = {}) {
  const oldAction = descriptor.value
  if (typeof oldAction !== 'function') throw new Error(`${name} is not a function`)

  descriptor.value = async function result() {
    const self: WebAPIStore = this
    if (self.isFetching) return this.listenFetchAction()
    try {
      self.setPendingState(name)
      let res
      const oldResult = await oldAction.apply(self, arguments)
      if (oldResult.next) res = await generatorRun(oldResult, name)
      else res = oldResult
      self.setFulfilledState(res, name)
    } catch (err) {
      self.setRejectedState(err, name)
      toast.error(err.message)
      throw err
    }
  }

  return bound ? action.bound(target, name, descriptor) : action(target, name, descriptor)
}

function fetchActionDecoratorCreate(options: Object) {
  return (...args) => fetchActionDecorator(...args, options)
}

export default function fetchAction(...args) {
  if (args.length === 3) {
    return fetchActionDecorator(...args)
  } else {
    return fetchActionDecoratorCreate(args[0])
  }
}

fetchAction.bound = fetchActionDecoratorCreate({ bound: true })
