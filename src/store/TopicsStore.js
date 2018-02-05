import { IObservableArray, Collection } from './helper'
import type { SimpleTopic } from '@model'
import { cFetch } from '@utils'

export class TopicsStore extends Collection {
  tab = this.instanceKey

  parameters = {
    mdrender: false,
    tab: this.tab,
  }

  meta = {
    total: 100,
    page: 1,
    per_page: 20,
  }

  data: IObservableArray<SimpleTopic>

  async fetchApi(params) {
    params.limit = params.per_page
    const res = await cFetch('topics', { params })
    const { per_page, page } = params
    res.data.meta = { per_page, page, total: 100 }
    return res
  }
}
