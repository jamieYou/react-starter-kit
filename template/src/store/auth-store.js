import { WebAPIStore, fetchAction, observables } from 'mobx-multiple-store'
import { fly } from '@utils'

@observables({
  id: 0,
  created_at: '',
})
export class AuthStore extends WebAPIStore {
  @fetchAction.merge
  login(body) {
    return fly.post('sessions', body)
  }

  @fetchAction.merge
  fetchData() {
    return fly.get('login_example')
  }
}

export const authStore = new AuthStore()
