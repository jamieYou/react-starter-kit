import { Toast } from 'antd-mobile'

function changePromise(name) {
  return (content, duration, mask): Promise =>
    new Promise(resolve =>
      Toast[name](content, duration, resolve, mask)
    )
}

const toast = {
  success: changePromise('success'),
  fail: changePromise('fail'),
  info: changePromise('info'),
  loading: changePromise('loading'),
  offline: changePromise('offline'),
  hide: Toast.hide,
}

export default toast
