import { Toast } from 'antd-mobile'

function changePromise(name, defaultDuration = 1.5) {
  return (content, duration = defaultDuration, mask): Promise =>
    new Promise(resolve => Toast[name](content, duration, resolve, mask))
}

const toast = {
  success: changePromise('success'),
  fail: changePromise('fail'),
  info: changePromise('info'),
  loading: changePromise('loading', 0),
  offline: changePromise('offline'),
  hide: Toast.hide,
}

export default toast
