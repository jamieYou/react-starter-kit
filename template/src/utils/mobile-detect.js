export const md = {
  match(str) {
    return new RegExp(str, 'i').test(navigator.userAgent)
  },

  get isIPhone() {
    return !this.match('wechatdevtools') && this.match('iPhone')
  }
}
