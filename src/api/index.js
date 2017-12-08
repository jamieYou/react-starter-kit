import cFetch, { apiRes } from './cFetch'
import _ from 'lodash'

export async function getTopics(params: { page: number, limit: number, tab: string, mdrender: boolean }): apiRes {
  const res = await cFetch('topics', { params })
  const complete = res.jsonResult.data.length === 0
  res.jsonResult.meta = _.merge({ limit: 40, page: 1, tab: 'all', mdrender: true, complete }, params)
  return res
}
