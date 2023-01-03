import { shallowMount } from '@vue/test-utils'
import genlocalVue from '../localVue'
import Vuex from 'vuex'
import { mockFirebaseResult } from '../../../mocks/firebase.mock'
import { mockStore } from '../../../mocks/store.mock'
import { FakeRooms, FakeCategories, FakeReadings, FakeFirstDate } from '../../../data/fake-data'
import RecentDataPanel from '@/components/home/recent-data-panel'

function genPropsData () {
  return {
    room: FakeRooms[0],
    idRoom: 'room1',
    categories: FakeCategories,
    timeLimit: FakeFirstDate
  }
}
function genWrapper (propsData) {
  const localVue = genlocalVue()
  const store = new Vuex.Store(mockStore)
  return shallowMount(RecentDataPanel, {
    localVue,
    store,
    propsData
  })
}

describe('RecentDataPanel.vue', () => {
  it('shows a panel with many values', () => {
    mockFirebaseResult.mockReset()
    mockFirebaseResult.mockReturnValue({
      val () {
        return FakeReadings[0]
      }
    })

    const wrapper = genWrapper(genPropsData())
    expect(wrapper.html()).toMatchSnapshot()
  })
  it('shows the room label passed in props', () => {
    mockFirebaseResult.mockReset()
    mockFirebaseResult.mockReturnValue({
      val () {
        return FakeReadings[0]
      }
    })

    const wrapper = genWrapper(genPropsData())
    const p = wrapper.find('.panel-footer > p')
    expect(p.text()).toBe('Room One')
  })
  it('does not show a warning icon if the reading is recent', () => {
    mockFirebaseResult.mockReset()
    mockFirebaseResult.mockReturnValue({
      val () {
        return FakeReadings[0]
      }
    })
    const data = genPropsData()
    data.timeLimit = FakeFirstDate - 1

    const wrapper = genWrapper(data)

    const icon = wrapper.find('.glyphicon-warning-sign')
    expect(icon.exists()).toBe(false)
  })
  it('shows a warning icon if the reading is too old', () => {
    mockFirebaseResult.mockReset()
    mockFirebaseResult.mockReturnValue({
      val () {
        return FakeReadings[0]
      }
    })
    const data = genPropsData()
    data.timeLimit = FakeFirstDate + 1

    const wrapper = genWrapper(data)

    const icon = wrapper.find('.glyphicon-warning-sign')
    expect(icon.exists()).toBe(true)
  })
})
