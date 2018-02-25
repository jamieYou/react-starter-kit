//http://es6.ruanyifeng.com/#docs/promise#Promise-prototype-finally
Promise.prototype.finally = function (cb) {
  return this.then(
    value => Promise.resolve(cb()).then(() => value),
    reason => Promise.resolve(cb()).then(() => {
      throw reason
    })
  )
}

// 捕获未处理的Promise错误, 让监听插件可以监听到(会有兼容问题，有没有效只能随缘)
window.addEventListener('unhandledrejection', event => {
  event.promise.catch(err => {
    setTimeout(() => {
      throw err
    }, 0)
  })
})
