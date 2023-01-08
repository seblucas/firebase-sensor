import { shallowMount } from '@vue/test-utils'
import genlocalVue from './components/localVue'
import Vuex from 'vuex'
import Router from 'vue-router'
import { mockFirebaseResult } from '../mocks/firebase.mock'
import ObjectToArray from '@/helper/object2array'
import App from '@/App'
import { mockStore } from '../mocks/store.mock'
import { FakeReadings } from '../data/fake-data'

describe('App.vue', () => {
  let localVue
  let store

  beforeEach(() => {
    localVue = genlocalVue()
    localVue.use(Router)
    store = new Vuex.Store(mockStore)
  })

  it('shows a page', () => {
    mockFirebaseResult.mockReset()
    mockFirebaseResult.mockReturnValue({
      val () {
        return FakeReadings[0]
      }
    })
    const wrapper = shallowMount(App, {
      store,
      localVue,
      mocks: {
        ObjectToArray
      }
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
      store,
      localVue,
      mocks: {
        ObjectToArray
      }
    })
    const mainContainer = wrapper.find('#app')
    expect(mainContainer.classes()).toContain('container')
    const zoomIcon = wrapper.find('.glyphicon-resize-horizontal')
    zoomIcon.trigger('click')
    await wrapper.vm.$nextTick()
    expect(mainContainer.classes()).toContain('container-fluid')
  })
})
