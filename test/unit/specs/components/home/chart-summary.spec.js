import { shallowMount } from '@vue/test-utils'
import ChartSummary from '@/components/home/chart-summary'
import ObjectToArray from '@/helper/object2array'
import DevLog from '../../../mocks/devLog.mock'
import { $firebase, firebaseResult } from '../../../mocks/firebase.mock'
import { FakeRooms, FakeCategories, FakeRawReadings } from '../../../data/fake-data'

const propsData = {
  rooms: {
    room1: FakeRooms[0]
  },
  categories: FakeCategories
}

describe('ChartSummary.vue', () => {
  it('shows a page', () => {
    firebaseResult.mockReset()
    firebaseResult.mockReturnValue(FakeRawReadings)

    const wrapper = shallowMount(ChartSummary, {
      propsData,
      mocks: {
        DevLog,
        ObjectToArray,
        $firebase
      }
    })
    expect(wrapper.vm.chartReadyCount).toBe(1)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
