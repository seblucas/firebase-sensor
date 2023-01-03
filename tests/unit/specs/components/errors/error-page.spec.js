import { shallowMount } from '@vue/test-utils'
import genlocalVue from '../localVue'
import Vuex from 'vuex'
import ErrorPage from '@/components/errors/error-page'
import { FakeErrors } from '../../../data/fake-data'

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
