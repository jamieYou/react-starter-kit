import fetch from 'isomorphic-fetch'
import qs from 'qs'
import _ from 'lodash'

const apiUrl = `${location.origin}/api/v1`

async function jsonParse(response) {
  const text = await response.text()
  return { status: response.status, url: response.url, jsonResult: text ? JSON.parse(text) : {} }
}

export type responseType = {
  url: string,
  status: number,
  jsonResult: Object | Array
}

export type errType = {
  status: number,
  message: string
}

export default async function cFetch(pathname, options): Promise<responseType, errType> {
  let mergeUrl = apiUrl + pathname
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
    const err = new Error(_.get(result, 'jsonResult.error_msg'))
    err.status = result.status
    throw err
  }
}
