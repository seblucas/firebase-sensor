import { shallowMount } from '@vue/test-utils'
import ChartDetail from '@/components/home/chart-detail'
import DevLog from '../../../mocks/devLog.mock'
import ObjectToArray from '@/helper/object2array'
import { $firebase, firebaseResult } from '../../../mocks/firebase.mock'
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

describe('ChartDetail.vue', () => {
  it('shows a graph', () => {
    const wrapper = shallowMount(ChartDetail, {
      propsData: genPropsData(),
      mocks: { DevLog },
      attachToDocument: true
    })
    expect(wrapper.html().replace(/nv-edge-clip-[\d]*/g, '')
      .replace(/nv-chart-[\d]*/g, '')
      .replace(/id="[^"]*"/g, '')
      .replace(/clip-path="[^"]*"/g, '')
      // .replace(/d="[^"]*"/g, '')
      .replace(/class="[^"]*"/g, '')
      .replace(/transform="[^"]*"/g, '')).toMatchSnapshot()
  })
  it('load the data from Firebase if prop is empty', () => {
    firebaseResult.mockReset()
    firebaseResult.mockReturnValue(FakeRawReadings)

    const propsData = genPropsData()
    propsData.readings = null
    const wrapper = shallowMount(ChartDetail, {
      propsData,
      mocks: { DevLog, $firebase, ObjectToArray },
      attachToDocument: true
    })
    expect(wrapper.vm.data).toHaveLength(1)
  })
  it('should reload the graph if the category is changed', () => {
    const wrapper = shallowMount(ChartDetail, {
      propsData: genPropsData(),
      mocks: { DevLog },
      attachToDocument: true
    })
    const loadDataAndGraph = jest.fn()
    wrapper.setMethods({ loadDataAndGraph })
    wrapper.setProps({ category: FakeCategories[1] })
    expect(loadDataAndGraph).toHaveBeenCalled()
  })
  it('should reload the graph if the number of hours is changed', () => {
    const wrapper = shallowMount(ChartDetail, {
      propsData: genPropsData(),
      mocks: { DevLog },
      attachToDocument: true
    })
    const loadDataAndGraph = jest.fn()
    wrapper.setMethods({ loadDataAndGraph })
    wrapper.setProps({ numberOfHours: 48 })
    expect(loadDataAndGraph).toHaveBeenCalled()
  })
  it('should filter the data coming from Firebase to avoid having too old data')
  it('should generate correct nvd3 parameter')
})
