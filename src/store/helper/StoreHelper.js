import { action, observable, toJS, useStrict } from 'MobX'
import _ from 'lodash'

useStrict(true)

export default class StoreHelper {
  static _instanceList: Map

  static get instanceList(): Map {
    if (!this._instanceList) {
      this._instanceList = observable.shallowMap({})
    }
    return this._instanceList
  }

  static findOrCreate(instanceKey, initialState) {
    if (!instanceKey) {
      throw new Error('instanceKey is not defined')
    }
    instanceKey = String(instanceKey)
    let instance
    if (!this.instanceList.has(instanceKey)) {
      this.instanceList.set(instanceKey, new this(instanceKey))
      instance = this.instanceList.get(instanceKey)
      initialState && instance.setInitialState(initialState)
    } else {
      instance = this.instanceList.get(instanceKey)
    }
    return instance
  }

  static createOrUpdate(instanceKey, initialState) {
    if (!instanceKey) {
      throw new Error('instanceKey is not defined')
    }
    instanceKey = String(instanceKey)
    if (!this.instanceList.has(instanceKey)) {
      this.instanceList.set(instanceKey, new this(instanceKey))
    }
    const instance = this.instanceList.get(instanceKey)
    initialState && instance.setInitialState(initialState)
    return instance
  }

  instanceKey: string
  @observable isFetching = false
  @observable isRejected = false
  @observable isFulfilled = false
  @observable error: Error | null = null

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
  setFulfilledState(response = {} | Function, actionName) {
    if (this.isFetching) {
      if (typeof response === 'function') {
        response = response()
      }
      const newState = _.get(response, 'jsonResult', response)
      Object.assign(this, {
        isFetching: false,
        isRejected: false,
        isFulfilled: true,
        error: null,
      }, newState)
    }
    console.log("%cfulfilled", "color:green", this.logMessage(actionName))
    return response
  }

  @action
  setRejectedState(error = {}, actionName) {
    const nextState = {
      error: _.get(error, 'jsonResult', error),
      isFetching: false,
      isRejected: true,
    }
    Object.assign(this, nextState)
    console.log("%crejected", "color:red", this.logMessage(actionName))
    return error
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
