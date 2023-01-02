import { mockFirebaseResult } from '../../../mocks/firebase.mock'
import { shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import ChartSummary from '@/components/home/chart-summary'
import ObjectToArray from '@/helper/object2array'
import genlocalVue from '../localVue'
import DevLog from '../../../mocks/devLog.mock'
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
    const localVue = genlocalVue()
    const store = new Vuex.Store(mockStore)

    const wrapper = shallowMount(ChartSummary, {
      localVue,
      propsData,
      store,
      mocks: {
        DevLog,
        ObjectToArray
      }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.chartReadyCount).toBe(1)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
