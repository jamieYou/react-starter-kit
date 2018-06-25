import { WebAPIStore, fetchAction, observables } from './helper'
import { CRequest } from '@utils'

@observables({
  id: 0,
  created_at: '',
})
export class AuthStore extends WebAPIStore {
  @fetchAction.merge
  login(body) {
    return CRequest.post('sessions').body(body)
  }

  @fetchAction.merge
  fetchData() {
    return CRequest.get('users/current')
  }
}

export const authStore: AuthStore = new AuthStore()
