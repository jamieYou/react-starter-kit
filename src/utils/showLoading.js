import { Toast } from 'antd-mobile'
import sleep from './sleep'

export default async function showLoading(promise: Promise, content = '加载中') {
  await sleep(0)
  Toast.loading(content, 0)
  try {
    const res = await promise
    Toast.hide()
    return res
  } catch (err) {
    Toast.hide()
    Toast.offline(err.message || '网络连接失败!!!', err.status === 404 ? 0 : 2)
    throw err
  }
}
