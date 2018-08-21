import toast from './toast'

const ignoreErrors = ['cancel']

async function loading(promise, title = '加载中', successMessage, failMessage, showLoading = true): Promise {
  if (showLoading) toast.loading(title)
  return promise
    .finally(() => {
      if (showLoading) toast.hide()
    })
    .then(async res => {
      if (successMessage) await toast.success(successMessage)
      return res
    })
    .catch(err => {
      if (!ignoreErrors.includes(err.message)) toast.fail(failMessage || err.message)
      throw err
    })
}

function loadingDecorator({ title, successMessage, failMessage, showLoading } = {}) {
  return function (target, name, descriptor: { value: (...any) => Promise }) {
    const func = descriptor.value
    descriptor.value = function () {
      return loading(func.apply(this, arguments), title, successMessage, failMessage, showLoading)
    }
  }
}

export default function autoLoading(...args) {
  if (args[0] instanceof Promise) {
    return loading(...args)
  } else if (args.length === 3) {
    return loadingDecorator()(...args)
  } else {
    return loadingDecorator(args[0])
  }
}
