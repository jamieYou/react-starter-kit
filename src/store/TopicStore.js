import { observables, WebAPIStore, fetchAction } from './helper'
import type { Topic } from '@model'
import { cFetch } from '@utils'

@observables({
  create_at: "",
  title: '',
  tab: '',
  content: '',
  good: false,
  top: false,
  last_reply_at: '',
  reply_count: 0,
  visit_count: 0,
  author: {
    avatar_url: '',
    loginname: '',
  },
  author_id: '',
  is_collect: false,
  replies: [],
})
export class TopicStore extends WebAPIStore implements Topic {
  id = this.instanceKey

  @fetchAction.bound
  fetchData() {
    return cFetch(`topic/${this.id}`).then(res => res.data.data)
  }
}
