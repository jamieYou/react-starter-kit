import { WebAPIStore, action, computed, observable, fetchAction } from 'mobx-multiple-store'
import { autoBind } from '@utils'

export class Collection extends WebAPIStore {
  static defaultParams = {
    page: 1,
    per_page: 10,
  }

  fetch = new Function

  @observable meta = { total: 0 }
  @observable data = []
  @observable parameter = this.constructor.defaultParams

  @autoBind
  @fetchAction.merge
  fetchData() {
    return this.fetch(this.params)
  }

  @fetchAction.flow
  async* fetchMoreData() {
    this.params.page = this.meta.page + 1
    const res = yield this.fetch(this.params)
    const { meta, data } = res.data
    this.meta = meta
    this.data.push(...data)
  }

  @action.bound
  resetData() {
    this.isFulfilled = false
    this.data.clear()
  }

  @computed
  get params() {
    return this.parameter
  }

  set params(properties) {
    this.parameter = Object.assign({}, this.constructor.defaultParams, properties)
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
