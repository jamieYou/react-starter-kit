import fetch from 'isomorphic-fetch'
import qs from 'qs'
import _ from 'lodash'
import { apiOrigin } from '@constants'
import urlConcat from './urlConcat'

async function jsonParse(response) {
  const text = await response.text()
  response.data = text ? JSON.parse(text) : {}
  return response
}

export interface ResponseType extends Response {
  data: Object | Array;
}

export interface ErrorType extends Error {
  status: number;
}

export type apiRes = Promise<ResponseType, ErrorType>;

export default async function cFetch(pathname, options): apiRes {
  let mergeUrl = urlConcat(apiOrigin, 'api/v1', pathname)
  const defaultOptions = {
    method: 'GET',
    // fetch api 默认不支持 set-cookie
    // 增加 credentials 参数来支持 set-cookie
    // https://github.com/github/fetch#sending-cookies
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  }
  const opts = Object.assign({}, defaultOptions, options)
  mergeUrl = `${mergeUrl}?${qs.stringify(opts.params)}`

  if (_.isObject(opts.body)) {
    opts.body = JSON.stringify(opts.body)
  }

  const response = await fetch(mergeUrl, opts)
  const result = await jsonParse(response)
  if (result.status >= 200 && result.status < 300) {
    return result
  } else {
    // 需要和后端定义错误信息的字段(error_msg)
    const err = new Error(_.get(result, 'data.error', '未知错误'))
    err.status = result.status
    throw err
  }
}
