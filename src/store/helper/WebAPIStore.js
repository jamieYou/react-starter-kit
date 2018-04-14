import { action, observable, toJS, autorun, computed } from 'mobx'
import { StoreHelper } from './StoreHelper'
import type { ErrorType, CResponse } from '@utils'

export class WebAPIStore extends StoreHelper {
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
  setFulfilledState(response: CResponse | Object, actionName) {
    const newState = do {
      if (response instanceof window.Response) response.data
      else response
    }
    Object.assign(this, {
      isFetching: false,
      isRejected: false,
      isFulfilled: true,
      error: null,
    }, newState)
    console.log("%cfulfilled", "color:green", this.logMessage(actionName))
  }

  @action
  setRejectedState(error, actionName, options) {
    const nextState = {
      error,
      isFetching: false,
      isRejected: true,
    }
    Object.assign(this, nextState, options)
    console.log("%crejected", "color:red", this.logMessage(actionName))
  }

  listenFetchAction(): Promise {
    if (!this.isFetching) return Promise.resolve()
    return new Promise((resolve, reject) => {
      const disposer = autorun(() => {
        if (!this.isFetching) {
          disposer()
          if (this.isRejected) reject(this.error)
          else resolve()
        }
      })
    })
  }

  logMessage(actionName) {
    return {
      store: this.constructor.name,
      instanceKey: this.instanceKey,
      action: actionName,
      state: toJS(this)
    }
  }

  loadingAll(...webAPIStores: WebAPIStore[]) {
    return this.loading || !!webAPIStores.find(item => item.loading)
  }

  @computed
  get loading() {
    return this.isFetching
  }
}
