import { shallow, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import ErrorPage from '@/components/errors/error-page'
import { FakeErrors } from '../../../data/fake-data'

function genlocalVue () {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  localVue.filter('formatDate', (value) => {
    if (value) {
      return new Date(value * 1000).toLocaleString()
    }
  })
  return localVue
}

describe('ErrorPage.vue', () => {
  let getters
  let store
  let localVue

  beforeEach(() => {
    localVue = genlocalVue()
    getters = {
      errors: () => FakeErrors
    }

    store = new Vuex.Store({
      getters
    })
  })

  it('shows a page', () => {
    const wrapper = shallow(ErrorPage, {
      store,
      localVue
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
