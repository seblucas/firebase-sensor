import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import ErrorPage from '@/components/errors/error-page'
import { FakeErrors } from '../../../data/fake-data'

function genlocalVue () {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  localVue.filter('formatDate', (value) => {
    if (value) {
      return new Date(value * 1000).toLocaleString('en-US')
    }
  })
  return localVue
}

describe('ErrorPage.vue', () => {
  let getters
  let actions
  let store
  let localVue

  beforeEach(() => {
    localVue = genlocalVue()
    getters = {
      errors: () => FakeErrors
    }
    actions = {
      removeError: jest.fn()
    }

    store = new Vuex.Store({
      getters,
      actions
    })
  })

  it('shows a page', () => {
    const wrapper = shallowMount(ErrorPage, {
      store,
      localVue
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
  it('should call the remove action when the bin icon is clicked on', () => {
    const wrapper = shallowMount(ErrorPage, {
      store,
      localVue
    })
    const deleteIcon = wrapper.find('.col-lg-12:first-child .glyphicon-trash')
    deleteIcon.trigger('click')

    expect(actions.removeError).toHaveBeenCalled()
  })
})
