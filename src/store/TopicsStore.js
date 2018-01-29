import { observable, IObservableArray } from './helper'
import { Collection } from './Collection'
import type { SimpleTopic } from '@model'
import cFetch from '@api/cFetch'

export class TopicsStore extends Collection {
  tab = this.instanceKey

  parameters = {
    mdrender: false,
    tab: this.tab,
  }

  @observable meta = {
    total: 100,
    page: 1,
    per_page: 20,
  }

  @observable.shallow data: IObservableArray<SimpleTopic> = []

  async fetchApi(params) {
    params.limit = params.per_page
    const res = await cFetch('topics', { params })
    const { per_page, page } = params
    res.jsonResult.meta = { per_page, page, total: 100 }
    return res
  }
}
