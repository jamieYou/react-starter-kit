// http://es6.ruanyifeng.com/#docs/promise#finally
Promise.prototype.finally = function (callback) {
  return this.then(
    res => {
      callback()
      return res
    },
    err => {
      callback()
      throw err
    }
  )
}
