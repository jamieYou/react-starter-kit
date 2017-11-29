import { mount } from 'enzyme'
import React from 'react'
import { Route, MemoryRouter } from 'react-router-dom'
import { TopicsStore } from '@store'
import Demo from '@routes/Demo/Demo'

describe('Demo', () => {
  it('render Demo', async () => {
    const tab = 'all'
    const topicsStore: TopicsStore = TopicsStore.findOrCreate(tab)
    await topicsStore.fetchTopics()
    const wrapper = mount(
      <MemoryRouter initialEntries={[`/topics/${tab}`]} initialIndex={1}>
        <Route path="/topics/:tab" component={Demo}/>
      </MemoryRouter>
    )
    expect(
      wrapper.find('.am-list-item')
    ).to.have.length(topicsStore.data.length)
  })
})
