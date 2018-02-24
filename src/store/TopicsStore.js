import { IObservableArray, Collection } from './helper'
import type { Topic } from '@model'
import { CRequest } from '@utils'

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

  data: IObservableArray<Topic>

  async fetchApi(params) {
    params.limit = params.per_page
    const res = await CRequest.get('topics').query(params)
    const { per_page, page } = params
    res.data.meta = { per_page, page, total: 100 }
    return res
  }
}
