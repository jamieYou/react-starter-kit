import { Toast } from 'antd-mobile'
import { reaction } from 'mobx'
import { routerStore } from '@store'

let disposer

function changePromise(name, defaultDuration = 1.5) {
  return (content, duration = defaultDuration, mask): Promise =>
    new Promise(resolve => {
      if (duration === 0) {
        if (disposer) disposer()
        disposer = reaction(
          () => routerStore.location,
          () => {
            toast.hide()
            disposer()
            disposer = null
          }
        )
      }
      setTimeout(resolve, duration)
      return Toast[name](content, duration, resolve, mask)
    })
}

const toast = {
  success: changePromise('success'),
  fail: changePromise('fail', 2),
  info: changePromise('info'),
  loading: changePromise('loading', 0),
  offline: changePromise('offline'),
  hide: Toast.hide,
}

export default toast
