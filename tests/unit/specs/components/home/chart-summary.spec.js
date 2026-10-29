import { mockFirebaseResult } from '../../../mocks/firebase.mock'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import ChartSummary from '@/components/home/chart-summary'
import testGlobalOptions from '../testOptions'
import { mockStore } from '../../../mocks/store.mock'
import { FakeRooms, FakeCategories, FakeRawReadings } from '../../../data/fake-data'

const propsData = {
  rooms: {
    room1: FakeRooms[0]
  },
  categories: FakeCategories
}

describe('ChartSummary.vue', () => {
  it('shows a page', async () => {
    mockFirebaseResult.mockReset()
    mockFirebaseResult.mockResolvedValue(FakeRawReadings)
    const store = createStore(mockStore)

    const wrapper = shallowMount(ChartSummary, {
      global: testGlobalOptions(store),
      props: propsData
    })
    await flushPromises()
    expect(wrapper.vm.chartReadyCount).toBe(1)
    expect(wrapper.vm.isReadyChart).toBe(true)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
