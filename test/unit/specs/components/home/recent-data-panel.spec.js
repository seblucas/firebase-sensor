import { shallow, createLocalVue } from '@vue/test-utils'
import RecentDataPanel from '@/components/home/recent-data-panel'
import { $firebase, firebaseResult } from '../../../mocks/firebase.mock'
import { FakeRooms, FakeCategories, FakeReadings } from '../../../data/fake-data'

const propsData = {
  room: FakeRooms[0],
  idRoom: 'room1',
  categories: FakeCategories,
  timeLimit: 1514764800
}

describe('RecentDataPanel.vue', () => {
  it('shows a panel with many values', () => {
    firebaseResult.mockReset()
    firebaseResult.mockReturnValue(FakeReadings[0])

    const localVue = createLocalVue()
    localVue.filter('formatDate', (value) => {
      if (value) {
        return new Date(value * 1000).toLocaleString()
      }
    })
    localVue.filter('formatNumber', (value, fractionSize) => {
      if (value) {
        return value.toLocaleString(undefined, { minimumFractionDigits: fractionSize, maximumFractionDigits: fractionSize })
      }
    })
    const wrapper = shallow(RecentDataPanel, {
      localVue,
      propsData,
      mocks: { $firebase }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
  it('shows the room label passed in props', () => {
    firebaseResult.mockReset()
    firebaseResult.mockReturnValue(false)

    const wrapper = shallow(RecentDataPanel, {
      propsData,
      mocks: { $firebase }
    })
    const h2 = wrapper.find('.panel-footer > p')
    expect(h2.text()).toBe('Room One')
  })
})
