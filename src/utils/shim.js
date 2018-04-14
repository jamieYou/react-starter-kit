Promise.prototype.finally = function (callback) {
  return this.then(
    value => Promise.resolve(callback()).then(() => value),
    reason => Promise.resolve(callback()).then(() => {
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
