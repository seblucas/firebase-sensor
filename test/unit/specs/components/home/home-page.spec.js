import { shallow, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import HomePage from '@/components/home/home-page'
import { FakeRooms, FakeCategories } from '../../../data/fake-data'

function generateStubs (cmp) {
  return Object.values(cmp.components).reduce((stubs, stubCmp) => {
    const dashName = stubCmp.name
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase()
    stubs[dashName] = {
      render (createElement) {
        return createElement(dashName, this.$slots.default)
      }
    }
    return stubs
  }, {})
}

const localVue = createLocalVue()

localVue.use(Vuex)

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
    const wrapper = shallow(HomePage, {
      store,
      localVue,
      stubs: generateStubs(HomePage)
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
