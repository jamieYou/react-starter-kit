import { StoreHelper, fetchAction, observable, IObservableArray, computed, action } from './helper'
import type { apiRes } from '@api/cFetch'
import type { meta } from '@model'

export class Collection extends StoreHelper {
  fetchApi: Object => apiRes

  parameters = {}

  @observable meta: meta = {
    total: 0,
    page: 1,
    per_page: 10,
  }

  @observable.shallow data: IObservableArray = []

  @fetchAction.bound
  fetchData() {
    return this.fetchApi({ page: 1, per_page: this.meta.per_page, ...this.parameters })
  }

  @fetchAction.bound
  async fetchMoreData() {
    const { jsonResult } = await this.fetchApi({
      page: this.meta.page + 1,
      per_page: this.meta.per_page,
      ...this.parameters,
    })
    const { meta, data } = jsonResult
    return {
      meta, data: this.data.concat(data)
    }
  }

  @fetchAction.bound
  reFetchData() {
    return this.fetchApi({ page: 1, per_page: this.data.length || this.meta.per_page, ...this.parameters })
      .then(res => ({ data: res.jsonResult.data }))
  }

  @computed
  get isComplete() {
    return this.isFulfilled && this.data.length >= this.meta.total
  }

  @action.bound
  resetData() {
    this.isFulfilled = false
    this.data.clear()
  }
}
