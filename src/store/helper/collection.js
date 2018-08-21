import { computed, action, extendObservable, IObservableArray } from 'mobx'
import { WebAPIStore } from './web-api-store'
import fetchAction from './fetch-action'
import { apiRes, autoBind } from '@utils'

export class Collection extends WebAPIStore {
  meta: {
    total: number,
    page: number,
    per_page: number,
  }
  data: IObservableArray
  fetchApi: Object => apiRes
  params: Object = {}

  constructor(...args) {
    super(...args)
    const state = {
      meta: {
        total: 0,
        page: 1,
        per_page: 10,
      }
    }
    if (!this.data) state.data = []
    extendObservable(this, state)
  }

  @autoBind
  @fetchAction.merge
  fetchData() {
    return this.fetchApi({ page: 1, per_page: this.meta.per_page, ...this.params })
  }

  @fetchAction.flow
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

  @fetchAction.flow
  async* reFetchData() {
    if (this.data.length) {
      const res = yield this.fetchApi({ page: 1, per_page: this.data.length, ...this.params })
      this.data = res.data.data
    } else {
      const res = yield this.fetchApi({ page: 1, per_page: this.meta.per_page, ...this.params })
      Object.assign(this, res.data)
    }
  }

  @action.bound
  resetData() {
    this.isFulfilled = false
    this.data.clear()
  }

  findItem(id: number) {
    return this.data.find(item => item.id === id)
  }

  @computed
  get isComplete() {
    return this.isFulfilled && this.data.length >= this.meta.total
  }

  @computed
  get loadMore() {
    const { isComplete, isFulfilled, fetchMoreData } = this
    return !isComplete && isFulfilled ? fetchMoreData : null
  }

  @computed
  get dataSource() {
    return this.data.slice()
  }
}
