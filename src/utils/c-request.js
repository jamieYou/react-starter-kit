import fetch from 'isomorphic-fetch'
import qs from 'qs'
import _ from 'lodash'
import { apiOrigin } from '@constants'
import urlConcat from './url-concat'

export interface CResponse extends Response {
  data: Object | Array;
}

export interface ErrorType extends Error {
  status: number;
}

export type apiRes = Promise<CResponse, ErrorType>

export class CRequest {
  static get(url, options): CRequest {
    return new this(url, options).method('get')
  }

  static post(url, options): CRequest {
    return new this(url, options).method('post')
  }

  static patch(url, options): CRequest {
    return new this(url, options).method('patch')
  }

  static put(url, options): CRequest {
    return new this(url, options).method('put')
  }

  static delete(url, options): CRequest {
    return new this(url, options).method('delete')
  }

  static apiConcat(pathname) {
    return urlConcat(apiOrigin, 'api/v1', pathname)
  }

  url = ''

  search = ''

  pathParams = null

  options = {
    method: 'GET',
    /** fetch api 默认不支持 set-cookie
     ** 增加 credentials 参数来支持 set-cookie
     ** https://github.com/github/fetch#sending-cookies
     **/
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  }

  constructor(url, options) {
    this.url = do {
      if (/^(http|https)/.test(url)) {
        url
      } else {
        urlConcat(apiOrigin, 'api/v1', url)
      }
    }
    Object.assign(this.options, options)
  }

  get mergeUrl() {
    let { url } = this
    if (this.pathParams) {
      const { interpolate } = _.templateSettings
      _.templateSettings.interpolate = /{([\s\S]+?)}/g
      url = _.template(this.url)(this.pathParams)
      _.templateSettings.interpolate = interpolate
    }
    return url + this.search
  }

  query(query: Object): CRequest {
    this.search = `?${qs.stringify(query)}`
    return this
  }

  body(body: Object | FormData): CRequest {
    this.options.body = do {
      if (body instanceof FormData) {
        delete this.options.headers['Content-Type']
        body
      } else {
        JSON.stringify(body)
      }
    }
    return this
  }

  formBody(body: Object) {
    const fd = new FormData()
    _.forEach(body, (item, key) => fd.append(key, item))
    return this.body(fd)
  }

  params(params: Object): CRequest {
    this.pathParams = params
    return this
  }

  headers(headers: Object): CRequest {
    Object.assign(this.options.headers, headers)
    return this
  }

  method(method: string): CRequest {
    this.options.method = method.toUpperCase()
    return this
  }

  async cFetch(): apiRes {
    const res: CResponse = await fetch(this.mergeUrl, this.options)
    res.data = await do {
      if (/application\/json/.test(res.headers.get('content-type'))) res.json()
      else res.text()
    }
    if (res.status >= 200 && res.status < 300) {
      return res
    } else {
      // 需要和后端定义错误信息的字段(error_msg)
      const err = new Error(_.get(res, 'data.error', '服务端错误'))
      err.status = res.status
      throw err
    }
  }

  then(success, fail) {
    return this.cFetch().then(success, fail)
  }

  catch(fail) {
    return this.cFetch().catch(fail)
  }

  finally(cb): apiRes {
    return this.cFetch().finally(cb)
  }
}
