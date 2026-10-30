import { vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import testGlobalOptions from '../testOptions'
import ErrorPage from '@/components/errors/error-page'
import { FakeErrors } from '../../../data/fake-data'

describe('ErrorPage.vue', () => {
  let getters
  let actions
  let store
  beforeEach(() => {
    getters = {
      errors: () => FakeErrors
    }
    actions = {
      removeError: vi.fn()
    }

    store = createStore({
      getters,
      actions
    })
  })

  it('shows a page', () => {
    const wrapper = shallowMount(ErrorPage, {
      global: testGlobalOptions(store)
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
  it('should call the remove action when the bin icon is clicked on', () => {
    const wrapper = shallowMount(ErrorPage, {
      global: testGlobalOptions(store)
    })
    const deleteButton = wrapper.find('.col-12:first-child button')
    deleteButton.trigger('click')

    expect(actions.removeError).toHaveBeenCalled()
  })
})
