import fly from 'flyio'
import _ from 'lodash'
import { apiOrigin } from '@constants'

fly.config.baseURL = apiOrigin + '/api/v1'

fly.interceptors.request.use(request => {
  if (request.formData) {
    const fd = new FormData()
    _.forEach(request.body, (item, key) => fd.append(key, item))
    request.body = fd
  }
  return request
})

fly.interceptors.response.use(
  res => {
    res.isResponse = true
    return res
  },
  err => {
    err.message = _.get(err.response.data, 'error', err.message)
    const isShowError = _.get(err.engine._options, 'isShowError', () => true)(err)
    isShowError && require('@component').toast.error(err.message)
    return err
  })

export default fly
