import { shallow } from '@vue/test-utils'
import ChartDetail from '@/components/home/chart-detail'
import DevLog from '../../../mocks/devLog.mock'
import { FakeRooms, FakeCategories, FakeReadings } from '../../../data/fake-data'

const propsData = {
  rooms: {
    room1: FakeRooms[0]
  },
  category: FakeCategories[0],
  numberOfHours: 24,
  readings: {
    room1: FakeReadings
  }
}

describe('ChartDetail.vue', () => {
  it('shows a graph', () => {
    const wrapper = shallow(ChartDetail, {
      propsData,
      mocks: { DevLog },
      attachToDocument: true
    })
    expect(wrapper.html().replace(/nv-edge-clip-[\d]*/g, '')
      .replace(/nv-chart-[\d]*/g, '')
      .replace(/id="[^"]*"/g, '')
      .replace(/clip-path="[^"]*"/g, '')
      .replace(/d="[^"]*"/g, '')
      .replace(/class="[^"]*"/g, '')
      .replace(/transform="[^"]*"/g, '')).toMatchSnapshot()
  })
})
