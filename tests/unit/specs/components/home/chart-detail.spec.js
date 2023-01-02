import { mockFirebaseResult } from '../../../mocks/firebase.mock'
import { shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import ChartDetail from '@/components/home/chart-detail'
import genlocalVue from '../localVue'
import DevLog from '../../../mocks/devLog.mock'
import { mockStore } from '../../../mocks/store.mock'
import ObjectToArray from '@/helper/object2array'
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
  const localVue = genlocalVue()
  const store = new Vuex.Store(mockStore)
  return shallowMount(ChartDetail, {
    localVue,
    store,
    mocks: { DevLog, ObjectToArray },
    attachTo: document.body,
    propsData
  })
}

describe('ChartDetail.vue', () => {
  it('shows a graph', () => {
    const wrapper = genWrapper(genPropsData())
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
    const spy = jest.spyOn(wrapper.vm, 'loadDataAndGraph')
    wrapper.setProps({ category: FakeCategories[1] })
    await wrapper.vm.$nextTick()
    expect(spy).toHaveBeenCalled()
    jest.restoreAllMocks()
  })
  it('should reload the graph if the number of hours is changed', async () => {
    const wrapper = genWrapper(genPropsData())
    const spy = jest.spyOn(wrapper.vm, 'loadDataAndGraph')
    wrapper.setProps({ numberOfHours: 48 })
    await wrapper.vm.$nextTick()
    expect(spy).toHaveBeenCalled()
    jest.restoreAllMocks()
  })
  it.skip('should filter the data coming from Firebase to avoid having too old data',
    () => {})
  it.skip('should generate correct nvd3 parameter', () => {})
})
