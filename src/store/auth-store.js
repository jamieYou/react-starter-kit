import { WebAPIStore, fetchAction, observables } from './helper'
import { CRequest } from '@utils'

@observables({
  id: 0,
  created_at: '',
})
export class AuthStore extends WebAPIStore {
  @fetchAction
  login(body) {
    return CRequest.post('sessions').body(body)
  }

  @fetchAction
  fetchData() {
    return CRequest.get('users/current')
  }
}

export const authStore: AuthStore = new AuthStore()
