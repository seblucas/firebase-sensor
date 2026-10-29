import { shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import testGlobalOptions from '../testOptions'
import CustomChartPage from '@/components/custom-chart/custom-chart-page'
import { FakeRooms, FakeCategories } from '../../../data/fake-data'

describe('CustomChartPage.vue', () => {
  let getters
  let store

  beforeEach(() => {
    getters = {
      rooms: () => FakeRooms,
      categoriesSorted: () => FakeCategories
    }

    store = createStore({
      getters
    })
  })

  it('shows a page', () => {
    const wrapper = shallowMount(CustomChartPage, {
      global: testGlobalOptions(store)
    })
    expect(wrapper.vm.rooms).toHaveLength(1)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
