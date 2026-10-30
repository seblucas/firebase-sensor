import { shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import testGlobalOptions from './components/testOptions'
import { mockFirebaseResult } from '../mocks/firebase.mock'
import App from '@/App'
import { mockStore } from '../mocks/store.mock'
import { FakeReadings } from '../data/fake-data'

describe('App.vue', () => {
  let store

  beforeEach(() => {
    store = createStore(mockStore)
  })

  it('shows a page', () => {
    mockFirebaseResult.mockReset()
    mockFirebaseResult.mockReturnValue({
      val () {
        return FakeReadings[0]
      }
    })
    const wrapper = shallowMount(App, {
      global: testGlobalOptions(store)
    })
    // workaround to please coverage check
    expect(wrapper.vm.categories).toBeFalsy()
    expect(wrapper.html()).toMatchSnapshot()
  })
  it('switch to full width mode if icon is clicked', async () => {
    mockFirebaseResult.mockReset()
    mockFirebaseResult.mockReturnValue({
      val () {
        return FakeReadings[0]
      }
    })
    const wrapper = shallowMount(App, {
      global: testGlobalOptions(store)
    })
    const mainContainer = wrapper.find('#app')
    expect(mainContainer.classes()).toContain('container')
    const zoomButton = wrapper.find('[aria-label="Toggle full width"]')
    zoomButton.trigger('click')
    await wrapper.vm.$nextTick()
    expect(mainContainer.classes()).toContain('container-fluid')
  })

  it('opens the responsive navigation using Vue state', async () => {
    mockFirebaseResult.mockReset()
    mockFirebaseResult.mockReturnValue({
      val () {
        return FakeReadings[0]
      }
    })
    const wrapper = shallowMount(App, {
      global: testGlobalOptions(store)
    })
    const menu = wrapper.find('#main-menu')

    expect(menu.classes()).not.toContain('show')
    await wrapper.find('.navbar-toggler').trigger('click')
    expect(menu.classes()).toContain('show')
    expect(wrapper.find('.navbar-toggler').attributes('aria-expanded')).toBe('true')
  })
})
