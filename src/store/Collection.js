import { StoreHelper, fetchAction, observable, IObservableArray, computed } from './helper'
import type { apiRes } from '@api/cFetch'
import type { meta } from '@constants'

export class Collection extends StoreHelper {
  @observable meta: meta = {
    total: 0,
    page: 1,
    per_page: 5,
  }

  options: Object = {}

  @observable.shallow data: IObservableArray = []

  fetchApi: meta => apiRes

  @fetchAction.bound
  fetchData(options?: meta) {
    this.options = options
    return this.fetchApi({ page: 1, per_page: this.meta.per_page, ...options })
  }

  @fetchAction.bound
  async fetchMoreData(options?: meta) {
    const { jsonResult } = await this.fetchApi({ page: this.meta.page + 1, per_page: this.meta.per_page, ...this.options, ...options })
    const { meta, data } = jsonResult
    return {
      meta, data: this.data.concat(data)
    }
  }

  @computed
  get complete() {
    return this.isFulfilled && this.data.length >= this.meta.total
  }
}
