import { shallow } from '@vue/test-utils'
import RecentDataPanel from '@/components/home/recent-data-panel'
import { $firebase, firebaseResult } from '../../../mocks/firebase.mock'

const propsData = {
  room: {
    label: 'room1',
    icon: 'icon1',
    color: 'red1'
  }
}

describe('RecentDataPanel.vue', () => {
  it('shows the room label passed in props', () => {
    firebaseResult.mockReset()
    firebaseResult.mockReturnValue(false)

    const wrapper = shallow(RecentDataPanel, {
      propsData,
      mocks: { $firebase }
    })
    const h2 = wrapper.find('.panel-footer > p')
    expect(h2.text()).toBe('room1')
  })
})
