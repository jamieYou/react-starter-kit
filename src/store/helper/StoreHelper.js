import { action, observable, toJS, useStrict } from 'mobx'
import _ from 'lodash'
import type { ErrorType } from '@api/cFetch'

useStrict(true)

export class StoreHelper<instanceKey: string> {
  static _instanceList: Map

  static get instanceList(): Map {
    if (!this._instanceList) {
      this._instanceList = observable.shallowMap({})
    }
    return this._instanceList
  }

  static create(instanceKey, initialState) {
    const store = new this(instanceKey)
    initialState && store.setInitialState(initialState)
    return store
  }

  static findOrCreate(instanceKey, initialState) {
    instanceKey = this.checkKey(instanceKey)
    if (!this.instanceList.has(instanceKey)) {
      this.instanceList.set(instanceKey, this.create(instanceKey, initialState))
    }
    return this.instanceList.get(instanceKey)
  }

  static createOrUpdate(instanceKey, initialState) {
    instanceKey = this.checkKey(instanceKey)
    if (!this.instanceList.has(instanceKey)) {
      this.instanceList.set(instanceKey, this.create(instanceKey, initialState))
    } else {
      initialState && this.instanceList.get(instanceKey).setInitialState(initialState)
    }
    return this.instanceList.get(instanceKey)
  }

  static checkKey(instanceKey) {
    if (!instanceKey) {
      throw new Error('instanceKey is not defined')
    }
    return String(instanceKey)
  }

  instanceKey: string
  @observable isFetching = false
  @observable isRejected = false
  @observable isFulfilled = false
  @observable error: ErrorType | null = null

  fetchData: Function

  constructor(instanceKey = 'only') {
    this.instanceKey = instanceKey
  }

  @action
  setInitialState(initialState) {
    Object.assign(this, initialState)
  }

  @action
  setPendingState(actionName) {
    this.isFetching = true
    console.log("%cpending  ", "color:blue", this.logMessage(actionName))
  }

  @action
  setFulfilledState(response: {} | Function, actionName) {
    if (this.isFetching) {
      const newState = typeof response === 'function' ? null : _.get(response, 'jsonResult', response)
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
