import { observable, StoreHelper, fetchAction, computed, IObservableArray } from './helper'
import { getTopics } from '@api'
import { sleep } from '@utils'

type topic = {
  id: string,
  title: string,
  content: string
}

export class TopicsStore extends StoreHelper {
  tab = this.instanceKey

  @observable meta = {
    page: 0,
    complete: false
  }

  @observable data: IObservableArray<topic> = []

  @fetchAction
  async fetchTopics(page = 1, limit = 10) {
    await sleep(1000)
    return getTopics({ page, limit, tab: this.tab, mdrender: false })
  }

  @computed
  get noMoreData() {
    return this.meta.complete
  }
}
