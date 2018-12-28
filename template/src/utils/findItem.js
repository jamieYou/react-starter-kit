import _ from 'lodash'

export default function findItem(list, search) {
  const index = _.findIndex(list, search)
  return {
    index: ~index ? index : null,
    item: ~index ? list[index] : null,
    auto_index: ~index ? index : _.size(list),
  }
}
