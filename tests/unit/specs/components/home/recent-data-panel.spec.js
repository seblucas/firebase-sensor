import { shallowMount, createLocalVue } from '@vue/test-utils'
import RecentDataPanel from '@/components/home/recent-data-panel'
import { $firebase, firebaseResult } from '../../../mocks/firebase.mock'
import { FakeRooms, FakeCategories, FakeReadings, FakeFirstDate } from '../../../data/fake-data'

function genPropsData () {
  return {
    room: FakeRooms[0],
    idRoom: 'room1',
    categories: FakeCategories,
    timeLimit: FakeFirstDate
  }
}

function genlocalVue () {
  const localVue = createLocalVue()
  localVue.filter('formatDate', (value) => {
    if (value) {
      return new Date(value * 1000).toLocaleString('en-US')
    }
  })
  localVue.filter('formatNumber', (value, fractionSize) => {
    if (value) {
      return value.toLocaleString(undefined, { minimumFractionDigits: fractionSize, maximumFractionDigits: fractionSize })
    }
  })
  return localVue
}

function genWrapper (propsData) {
  return shallowMount(RecentDataPanel, {
    localVue: genlocalVue(),
    propsData,
    mocks: { $firebase }
  })
}

describe('RecentDataPanel.vue', () => {
  it('shows a panel with many values', () => {
    firebaseResult.mockReset()
    firebaseResult.mockReturnValue(FakeReadings[0])

    const wrapper = genWrapper(genPropsData())
    expect(wrapper.html()).toMatchSnapshot()
  })
  it('shows the room label passed in props', () => {
    firebaseResult.mockReset()
    firebaseResult.mockReturnValue(false)

    const wrapper = genWrapper(genPropsData())
    const p = wrapper.find('.panel-footer > p')
    expect(p.text()).toBe('Room One')
  })
  it('does not show a warning icon if the reading is recent', () => {
    firebaseResult.mockReset()
    firebaseResult.mockReturnValue(FakeReadings[0])
    const data = genPropsData()
    data.timeLimit = FakeFirstDate - 1

    const wrapper = genWrapper(data)

    const icon = wrapper.find('.glyphicon-warning-sign')
    expect(icon.exists()).toBe(false)
  })
  it('shows a warning icon if the reading is too old', () => {
    firebaseResult.mockReset()
    firebaseResult.mockReturnValue(FakeReadings[0])
    const data = genPropsData()
    data.timeLimit = FakeFirstDate + 1

    const wrapper = genWrapper(data)

    const icon = wrapper.find('.glyphicon-warning-sign')
    expect(icon.exists()).toBe(true)
  })
})
