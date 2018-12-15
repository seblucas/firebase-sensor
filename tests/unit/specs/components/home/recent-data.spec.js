import { shallowMount } from '@vue/test-utils'
import RecentData from '@/components/home/recent-data'
import { FakeRooms, FakeCategories } from '../../../data/fake-data'

const propsData = {
  rooms: {
    room1: FakeRooms[0]
  },
  categories: FakeCategories
}

describe('RecentData.vue', () => {
  it('shows a page', () => {
    const wrapper = shallowMount(RecentData, {
      propsData
    })
    wrapper.vm.currentTimeLimit = 1514764800
    expect(wrapper.html()).toMatchSnapshot()
  })
})
