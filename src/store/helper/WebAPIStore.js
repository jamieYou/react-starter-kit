import { action, observable, toJS } from 'mobx'
import { StoreHelper } from './StoreHelper'
import type { ErrorType, ResponseType } from '@utils'

export class WebAPIStore<instanceKey: string> extends StoreHelper {
  fetchData: Function
  @observable isFetching = false
  @observable isRejected = false
  @observable isFulfilled = false
  @observable error: ?ErrorType = null

  @action
  setPendingState(actionName) {
    this.isFetching = true
    console.log("%cpending  ", "color:blue", this.logMessage(actionName))
  }

  @action
  setFulfilledState(response: ResponseType | Function | Object, actionName) {
    if (this.isFetching) {
      const newState = do {
        if (typeof response === 'function') null
        else if (response instanceof window.Response) response.data
        else response
      }
      Object.assign(this, {
        isFetching: false,
        isRejected: false,
        isFulfilled: true,
        error: null,
      }, newState)
      typeof response === 'function' && response()
    }
    console.log("%cfulfilled", "color:green", this.logMessage(actionName))
  }

  @action
  setRejectedState(error, actionName) {
    const nextState = {
      error,
      isFetching: false,
      isRejected: true,
    }
    Object.assign(this, nextState)
    console.log("%crejected", "color:red", this.logMessage(actionName))
  }

  logMessage(actionName) {
    return {
      store: this.constructor.name,
      instanceKey: this.instanceKey,
      action: actionName,
      state: toJS(this)
    }
  }
}
