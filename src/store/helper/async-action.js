import { flow } from 'mobx'
import { autoBind } from "@utils"

export default function asyncAction(target, name, descriptor) {
  const oldAction = descriptor.value
  if (typeof oldAction !== 'function') throw new Error(`${name} is not a function`)
  descriptor.value = flow(oldAction)
  return autoBind(target, name, descriptor)
}
