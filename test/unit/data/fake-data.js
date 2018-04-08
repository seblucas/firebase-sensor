export const FakeFirstDate = Math.round(new Date(2018, 1, 13, 11, 47, 51) / 1000)

export const FakeRooms = [
  {
    color: '#FFCCBC',
    icon: 'glyphicon-bed',
    label: 'Room One',
    readings: {
      other: 0,
      temp: 1,
      hum: 1
    }
  }
]

export const FakeCategories = [
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
]

export const FakeReadings = [
  { id: 'L00', time: FakeFirstDate, temp: 12.1, hum: 52, lum: 17 },
  { id: 'L01', time: FakeFirstDate + 60, temp: 12.4, hum: 72 }
]

export const FakeRawReadings = {
  'L00': { time: FakeFirstDate, temp: 12.1, hum: 52, lum: 17 },
  'L01': { time: FakeFirstDate + 60, temp: 12.4, hum: 72 }
}
