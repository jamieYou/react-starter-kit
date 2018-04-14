import { observable, action, computed } from 'mobx'
import type { location, history } from '@constants'

export class RouterStore {
  @observable.ref location: location = {}
  @observable.ref history: history = {}

  @action
  setRouter({ location, history }) {
    Object.assign(this, { location, history })
  }

  @computed
  get menuKeys(): string[] {
    return this.location.pathname.split('/').filter(item => item)
  }
}

export const routerStore: RouterStore = new RouterStore
