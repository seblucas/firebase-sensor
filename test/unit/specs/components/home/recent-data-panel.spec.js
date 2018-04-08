import { shallow, createLocalVue } from '@vue/test-utils'
import RecentDataPanel from '@/components/home/recent-data-panel'
import { $firebase, firebaseResult } from '../../../mocks/firebase.mock'

const propsData = {
  room: {
    color: '#FFCCBC',
    icon: 'glyphicon-bed',
    label: 'Room One',
    readings: {
      other: 0,
      temp: 1,
      hum: 1
    }
  },
  idRoom: 'room1',
  categories: [
    {
      id: 'temp',
      forceMax: 15,
      forceMin: 0,
      fractionSize: 1,
      label: 'Temperature',
      order: 1,
      unit: '°C'
    },
    {
      id: 'hum',
      forceMax: 80,
      forceMin: 40,
      fractionSize: 0,
      label: 'Humidity',
      order: 2,
      unit: '%'
    }
  ],
  timeLimit: 1514764800
}

describe('RecentDataPanel.vue', () => {
  it('shows a panel with many values', () => {
    firebaseResult.mockReset()
    firebaseResult.mockReturnValue({ id: 'L00', time: 1514764800, temp: 12.1, hum: 52, lum: 17 })

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
