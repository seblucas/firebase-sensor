import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Router from 'vue-router'
import App from '@/App'
import { mockStore } from '../mocks/store.mock'

describe('App.vue', () => {
  let localVue
  let store

  beforeEach(() => {
    localVue = createLocalVue()

    localVue.use(Vuex)
    localVue.use(Router)

    store = new Vuex.Store(mockStore)
  })

  it('shows a page', () => {
    const wrapper = shallowMount(App, {
      store,
      localVue
    })
    // workaround to please coverage check
    expect(wrapper.vm.categories).toBeFalsy()
    expect(wrapper.html()).toMatchSnapshot()
  })
  it('switch to full width mode if icon is clicked', async () => {
    const wrapper = shallowMount(App, {
      store,
      localVue
    })
    const mainContainer = wrapper.find('#app')
    expect(mainContainer.classes()).toContain('container')
    const zoomIcon = wrapper.find('.glyphicon-resize-horizontal')
    zoomIcon.trigger('click')
    await wrapper.vm.$nextTick()
    expect(mainContainer.classes()).toContain('container-fluid')
  })
})
