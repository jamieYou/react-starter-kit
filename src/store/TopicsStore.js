import { observable, StoreHelper, fetchAction, computed, IObservableArray } from './helper'
import cFetch from '@api/cFetch'
import { sleep } from '@utils'
import { Topic } from '@constants'
import _ from 'lodash'

export class TopicsStore extends StoreHelper {
  tab = this.instanceKey

  @observable meta = {
    page: 0,
    complete: false
  }

  @observable.shallow data: IObservableArray<Topic> = []

  @fetchAction
  async fetchTopics(page = 1, limit = 10) {
    await sleep(1000)
    const params = { page, limit, tab: this.tab, mdrender: false }
    const res = await cFetch('topics', { params, credentials: false })
    const complete = res.jsonResult.data.length === 0
    res.jsonResult.meta = _.merge({ limit: 40, page: 1, tab: 'all', mdrender: true, complete }, params)
    return res
  }

  @computed
  get noMoreData() {
    return this.meta.complete
  }
}
