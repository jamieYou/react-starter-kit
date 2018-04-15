import { WebAPIStore, fetchAction, observables } from './helper'
import { CRequest } from '@utils'

@observables({
  id: 0,
  created_at: '',
  isFulfilled: false,
})
export class AuthStore extends WebAPIStore {
  @fetchAction
  login(body) {
    return CRequest.post('sessions').body(body)
  }

  @fetchAction
  async logout() {
    await CRequest.delete('sessions')
    return this.initialState
  }

  @fetchAction
  fetchData() {
    return CRequest.get('users/current')
  }
}

export const authStore: AuthStore = new AuthStore()
