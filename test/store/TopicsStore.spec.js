import { TopicsStore } from '@store'

describe('TopicsStore: ', () => {
  it('TopicsStore->getTopics() should work fine.', async () => {
    const topicsStore: TopicsStore = TopicsStore.findOrCreate('dev')
    await topicsStore.fetchTopics()
    expect(
      topicsStore.isFulfilled
    ).to.be.equal(true)
  })
})
