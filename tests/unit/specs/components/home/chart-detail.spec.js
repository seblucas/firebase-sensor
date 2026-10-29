import { vi } from 'vitest'
import { mockFirebaseResult } from '../../../mocks/firebase.mock'
import { shallowMount } from '@vue/test-utils'
import { isReactive } from 'vue'
import { createStore } from 'vuex'
import ChartDetail from '@/components/home/chart-detail'
import testGlobalOptions from '../testOptions'
import { mockStore } from '../../../mocks/store.mock'
import { FakeRooms, FakeCategories, FakeReadings, FakeRawReadings } from '../../../data/fake-data'

function genPropsData () {
  return {
    rooms: {
      room1: FakeRooms[0]
    },
    category: FakeCategories[0],
    numberOfHours: 24,
    readings: {
      room1: FakeReadings
    }
  }
}

function genWrapper (propsData) {
  const store = createStore(mockStore)
  return shallowMount(ChartDetail, {
    global: testGlobalOptions(store),
    attachTo: document.body,
    props: propsData
  })
}

describe('ChartDetail.vue', () => {
  it('shows a graph', () => {
    const wrapper = genWrapper(genPropsData())
    expect(isReactive(wrapper.vm.chartData)).toBe(false)
    expect(isReactive(wrapper.vm.chart)).toBe(false)
    expect(wrapper.html().replace(/nv-edge-clip-[\d]*/g, '')
      .replace(/nv-chart-[\d]*/g, '')
      .replace(/id="[^"]*"/g, '')
      .replace(/clip-path="[^"]*"/g, '')
      // .replace(/d="[^"]*"/g, '')
      .replace(/class="[^"]*"/g, '')
      .replace(/transform="[^"]*"/g, '')).toMatchSnapshot()
  })
  it('load the data from Firebase if prop is empty', () => {
    mockFirebaseResult.mockReset()
    mockFirebaseResult.mockResolvedValue(FakeRawReadings)

    const propsData = genPropsData()
    propsData.readings = null
    const wrapper = genWrapper(propsData)
    expect(wrapper.vm.data).toHaveLength(1)
  })
  it('should reload the graph if the category is changed', async () => {
    const wrapper = genWrapper(genPropsData())
    const spy = vi.spyOn(wrapper.vm, 'loadDataAndGraph')
    wrapper.setProps({ category: FakeCategories[1] })
    await wrapper.vm.$nextTick()
    expect(spy).toHaveBeenCalled()
    vi.restoreAllMocks()
  })
  it('should reload the graph if the number of hours is changed', async () => {
    const wrapper = genWrapper(genPropsData())
    const spy = vi.spyOn(wrapper.vm, 'loadDataAndGraph')
    wrapper.setProps({ numberOfHours: 48 })
    await wrapper.vm.$nextTick()
    expect(spy).toHaveBeenCalled()
    vi.restoreAllMocks()
  })
  it.skip('should filter the data coming from Firebase to avoid having too old data',
    () => {})
  it.skip('should generate correct nvd3 parameter', () => {})
})
