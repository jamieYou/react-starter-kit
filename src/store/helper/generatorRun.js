import { action } from "mobx"

export default function generatorRun(gen: Generator, name) {
  const nextStep = action(`${name}-nextStep`, prevResult =>
    Promise.resolve(gen.next(prevResult)).then(({ value, done }) => {
      if (done) return value
      return Promise.resolve(value).then(nextStep, gen.throw)
    })
  )
  return nextStep()
}
