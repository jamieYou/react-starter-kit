import { computed, action } from 'mobx'
import type { IObservableArray } from 'mobx/lib/mobx.js.flow'
import { observables } from './observables'
import { WebAPIStore } from './WebAPIStore'
import fetchAction from './fetchAction'
import type { apiRes } from '@utils'
import type { meta } from '@model'

@observables({
  meta: {
    total: 0,
    page: 1,
    per_page: 10,
  },
  data: []
})
export class Collection extends WebAPIStore {
  meta: meta
  data: IObservableArray
  fetchApi: Object => apiRes
  parameters: ?Object = null

  @fetchAction.bound
  async fetchData() {
    const res = await this.fetchApi({ page: 1, per_page: this.meta.per_page, ...this.parameters })
    const { meta, data } = res.data
    return {
      meta, data: this.formatData(data)
    }
  }

  @fetchAction.bound
  async fetchMoreData() {
    const res = await this.fetchApi({
      page: this.meta.page + 1,
      per_page: this.meta.per_page,
      ...this.parameters,
    })
    const { meta, data } = res.data
    return {
      meta, data: this.data.concat(this.formatData(data))
    }
  }

  @fetchAction.bound
  reFetchData() {
    return this.fetchApi({ page: 1, per_page: this.data.length || this.meta.per_page, ...this.parameters })
      .then(res => ({ data: this.formatData(res.data.data) }))
  }

  formatData(data: []): data {
    return data
  }

  @action.bound
  resetData() {
    this.isFulfilled = false
    this.data.clear()
  }

  @computed
  get isComplete() {
    return this.isFulfilled && this.data.length >= this.meta.total
  }
}
