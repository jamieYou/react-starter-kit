import { observable, IObservableArray, StoreHelper, fetchAction } from './helper'
import type { Topic, Reply } from '@model'
import cFetch from '@api/cFetch'

export class TopicStore extends StoreHelper implements Topic {
  id = this.instanceKey

  @observable.shallow replies: IObservableArray<Reply> = []

  @fetchAction.bound
  fetchData() {
    return cFetch(`topic/${this.id}`).then(res => res.jsonResult.data)
  }
}
