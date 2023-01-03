import { shallowMount } from '@vue/test-utils'
import genlocalVue from '../localVue'
import Vuex from 'vuex'
import CustomChartPage from '@/components/custom-chart/custom-chart-page'
import { FakeRooms, FakeCategories } from '../../../data/fake-data'

const localVue = genlocalVue()

describe('CustomChartPage.vue', () => {
  let getters
  let store

  beforeEach(() => {
    getters = {
      rooms: () => FakeRooms,
      categoriesSorted: () => FakeCategories
    }

    store = new Vuex.Store({
      getters
    })
  })

  it('shows a page', () => {
    const wrapper = shallowMount(CustomChartPage, {
      store,
      localVue
    })
    expect(wrapper.vm.rooms).toHaveLength(1)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
