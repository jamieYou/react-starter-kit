import { observable, action, computed } from 'mobx'
import qs from "qs"
import type { location, history } from '@constants'

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
    this.history.push({ pathname, search: qs.stringify(query) })
  }

  @computed
  get query() {
    return qs.parse(this.location.search.replace(/^\?/, ''), {
      decoder(text) {
        if (/^(\d+|\d*\.\d+)$/.test(text)) return parseFloat(text)
        const keywords = { true: true, false: false, null: null }
        if (text in keywords) return keywords[text]
        try {
          return decodeURIComponent(text.replace(/\+/g, ' '))
        } catch (err) {
          return text
        }
      }
    })
  }
}

export const routerStore: RouterStore = new RouterStore
