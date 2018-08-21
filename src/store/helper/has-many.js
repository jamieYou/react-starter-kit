import { extendObservable, intercept, isObservable } from 'mobx'

export default function hasMany(target, name, descriptor) {
  const $name = '$' + name
  const { initializer } = descriptor

  function define$Name() {
    if (!this[$name]) {
      isObservable(this[$name]) || extendObservable(this, { [$name]: [] })

      Object.defineProperty(this, [$name], { enumerable: false })

      const formatItem = initializer.call(this)

      intercept(this, $name, change => {
        change.object.value.replace(change.newValue)
        change.newValue = change.object.value
        return change
      })

      intercept(this[$name], change => {
        const { newValue, added } = change
        if (newValue) change.newValue = formatItem([newValue])
        else if (added) change.added = added.map(formatItem)
        return change
      })
    }
    return this[$name]
  }

  return {
    get() {
      return define$Name.call(this)
    },

    set(value) {
      define$Name.call(this)
      this[$name] = value
    },

    configurable: false,
    enumerable: true,
  }
}
