import { computed, action } from 'mobx'
import type { IObservableArray } from 'mobx/lib/mobx.js.flow'
import { observables } from './observables'
import { WebAPIStore } from './WebAPIStore'
import fetchAction from './fetchAction'
import type { apiRes } from '@utils'

@observables({
  meta: {
    total: 0,
    page: 1,
    per_page: 10,
  },
  data: []
})
export class Collection extends WebAPIStore {
  meta: {
    total: number,
    page: number,
    per_page: number,
  }
  data: IObservableArray
  fetchApi: Object => apiRes
  params: Object = {}

  @fetchAction.bound
  fetchData() {
    return this.fetchApi({ page: 1, per_page: this.meta.per_page, ...this.params })
  }

  @fetchAction.bound
  async* fetchMoreData() {
    const res = yield this.fetchApi({
      page: this.meta.page + 1,
      per_page: this.meta.per_page,
      ...this.params,
    })
    const { meta, data } = res.data
    this.meta = meta
    this.data.push(...data)
  }

  @fetchAction.bound
  async* reFetchData() {
    const res = yield this.fetchApi({ page: 1, per_page: this.data.length || this.meta.per_page, ...this.params })
    this.data = res.data.data
  }

  @action.bound
  resetData() {
    this.isFulfilled = false
    this.data.clear()
  }

  findItemById(id: number) {
    return this.data.find(item => item.id === id)
  }

  @computed
  get isComplete() {
    return this.isFulfilled && this.data.length >= this.meta.total
  }

  @computed
  get dataSource() {
    return this.data.slice()
  }
}
