import { shallow } from '@vue/test-utils'
import ChartDetail from '@/components/home/chart-detail'
import DevLog from '../../../mocks/devLog.mock'

const propsData = {
  rooms: {
    room1: {
      color: '#FFCCBC',
      icon: 'glyphicon-bed',
      label: 'Room One',
      readings: {
        other: 0,
        temp: 1
      }
    }
  },
  category: {
    id: 'temp',
    forceMax: 15,
    forceMin: 0,
    fractionSize: 1,
    label: 'Temperature',
    order: 1,
    unit: '°C'
  },
  numberOfHours: 24,
  readings: {
    room1: [
      { id: 'L00', time: 1514764800, temp: 12.1 },
      { id: 'L01', time: 1514764860, temp: 12.4 }
    ]
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
