import toast from './toast'
import modal from './modal'

const ignoreErrors = ['cancel']

async function loading(func, title = '加载中', successMessage, failMessage, retry = true): Promise {
  const timer = setTimeout(() => toast.loading(title), 500)
  return Promise.resolve(func())
    .finally(() => {
      clearTimeout(timer)
      toast.hide()
    })
    .then(async res => {
      if (successMessage) await toast.success(successMessage)
      return res
    })
    .catch(err => {
      const msg = failMessage || err.message
      if (!ignoreErrors.includes(msg)) {
        if (retry) {
          modal.alert('请求失败', msg, [
            { text: '取消', style: 'default' },
            {
              text: '重新加载', onPress: () => {
                loading(...arguments)
              }
            },
          ])
        } else {
          toast.fail(msg)
        }
      }
      throw err
    })
}

function loadingDecorator({ title, successMessage, failMessage, retry } = {}) {
  return function (target, name, descriptor) {
    const func = descriptor.value
    descriptor.value = function () {
      return loading(() => func.apply(this, arguments), title, successMessage, failMessage, retry)
    }
  }
}

export default function autoLoading(...args) {
  if (args.length === 3) {
    return loadingDecorator()(...args)
  } else {
    return loadingDecorator(args[0])
  }
}
