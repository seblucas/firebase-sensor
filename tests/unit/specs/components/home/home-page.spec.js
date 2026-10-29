import { shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import testGlobalOptions from '../testOptions'
import HomePage from '@/components/home/home-page'
import { FakeRooms, FakeCategories } from '../../../data/fake-data'

describe('HomePage.vue', () => {
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
    const wrapper = shallowMount(HomePage, {
      global: testGlobalOptions(store)
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
