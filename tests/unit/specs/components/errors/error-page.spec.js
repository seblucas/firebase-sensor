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
  let errors
  beforeEach(() => {
    errors = FakeErrors
    getters = {
      errors: () => errors
    }
    actions = {
      removeError: vi.fn(),
      removeOldestErrors: vi.fn()
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

  it('deletes the first 100 displayed errors after confirmation', async () => {
    errors = Array.from({ length: 105 }, (_, index) => ({
      id: `error-${index}`,
      time: index,
      message: `Error ${index}`
    }))
    store = createStore({
      getters,
      actions
    })
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true)
    const wrapper = shallowMount(ErrorPage, {
      global: testGlobalOptions(store)
    })

    await wrapper.find('.btn-danger').trigger('click')

    expect(confirm).toHaveBeenCalledWith('Delete the first 100 errors shown? This cannot be undone.')
    expect(actions.removeOldestErrors.mock.calls[0][1]).toEqual(errors.slice(0, 100))
    confirm.mockRestore()
  })

  it('does not delete errors when the confirmation is declined', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
    const wrapper = shallowMount(ErrorPage, {
      global: testGlobalOptions(store)
    })

    await wrapper.find('.btn-danger').trigger('click')

    expect(actions.removeOldestErrors).not.toHaveBeenCalled()
    confirm.mockRestore()
  })
})
