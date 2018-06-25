import { observable, action, computed } from 'mobx'
import qs from 'qs'
import type { location, history } from '@constants'
import { decoder } from '@utils'

export class RouterStore {
  @observable.ref location: location = {}
  @observable.ref history: history = {}

  @action
  setRouter({ location, history }) {
    Object.assign(this, { location, history })
  }

  assignQuery(query) {
    this.query = { ...this.query, ...query }
  }

  set query(query) {
    const { pathname } = this.location
    this.history.push({ pathname, search: qs.stringify(query, { sort: (a, b) => a.localeCompare(b) }) })
  }

  @computed
  get query() {
    return qs.parse(this.location.search.replace(/^\?/, ''), { decoder })
  }
}

export const routerStore: RouterStore = new RouterStore
