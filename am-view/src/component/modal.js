import { Modal } from 'antd-mobile'
import { reaction } from 'mobx'
import { routerStore } from '@store'

function transform(name) {
  return function () {
    const instance = Modal[name].apply(Modal, arguments)
    const disposer = reaction(
      () => routerStore.location,
      () => {
        instance.close()
        disposer()
      }
    )
    return {
      close() {
        disposer()
        instance.close()
      }
    }
  }
}

const alert = transform('alert')
const prompt = transform('prompt')
const operation = transform('operation')

export default { alert, prompt, operation }
