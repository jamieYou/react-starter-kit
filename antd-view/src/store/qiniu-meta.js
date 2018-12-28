import { WebAPIStore, fetchAction, action } from 'mobx-multiple-store'
import { fly } from '@utils'

class QiniuMeta extends WebAPIStore {
  uptoken = ''
  bucket_domain = ''
  timer = null

  @fetchAction.merge
  async fetchData() {
    const res = await fly.get('qiniu_meta')
    clearTimeout(this.timer)
    const expires_in = (res.data.expires_in - 60) * 1000
    this.timer = expires_in && setTimeout(action('clear_expires_token', () => this.isFulfilled = false), expires_in)
    return res
  }
}

export const qiniuMeta = new QiniuMeta
