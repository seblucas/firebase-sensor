import { shallow, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import CustomChartPage from '@/components/custom-chart/custom-chart-page'
import { FakeRooms, FakeCategories } from '../../../data/fake-data'

const localVue = createLocalVue()

localVue.use(Vuex)

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
    const wrapper = shallow(CustomChartPage, {
      store,
      localVue
    })
    expect(wrapper.vm.rooms).toHaveLength(1)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
