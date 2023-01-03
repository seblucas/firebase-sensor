import { shallowMount } from '@vue/test-utils'
import genlocalVue from '../localVue'
import Vuex from 'vuex'
import HomePage from '@/components/home/home-page'
import { FakeRooms, FakeCategories } from '../../../data/fake-data'

const localVue = genlocalVue()

describe('HomePage.vue', () => {
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
    const wrapper = shallowMount(HomePage, {
      store,
      localVue
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
