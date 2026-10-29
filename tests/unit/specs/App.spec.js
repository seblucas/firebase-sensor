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
    const zoomIcon = wrapper.find('.glyphicon-resize-horizontal')
    zoomIcon.trigger('click')
    await wrapper.vm.$nextTick()
    expect(mainContainer.classes()).toContain('container-fluid')
  })
})
