<template>
  <div v-bind:id="category.id">
  </div>
</template>

<script>
import c3 from 'c3'

export default {
  name: 'chart-detail',
  data () {
    return {
      dataXs: {},
      dataColors: {},
      dataNames: {},
      data: [],
      chart: null
    }
  },
  props: ['rooms', 'category', 'readings', 'numberOfHours'],
  watch: {
    category () {
      this.DevLog('chart-detail / Category updated ', this.category.id)
      this.loadDataAndGraph()
    },
    numberOfHours () {
      this.DevLog('chart-detail / numberOfHours updated ', this.numberOfHours)
      this.loadDataAndGraph()
    }
  },
  methods: {
    loadDataFromFirebase (roomId, currentDatum) {
      var lowerTimeLimit = (new Date() / 1000) - 3600 * this.numberOfHours
      this.$firebase.database().ref('readings/' + roomId).limitToLast(4 * this.numberOfHours).once('value', (newValue) => {
        this.DevLog(`chart-detail / Loaded from database for ${roomId}`)
        var basicArray = this.ObjectToArray(newValue.val())
        // Remove too old readings
        basicArray = basicArray.filter((item) => {
          return item.time > lowerTimeLimit
        })
        currentDatum.values = basicArray
        if (this.chart) {
          this.chart.update()
        }
      })
    },
    loadData () {
      this.data = []
      this.dataXs = {}
      this.dataColors = {}
      this.dataNames = {}
      Object.keys(this.rooms).forEach((roomId) => {
        var room = this.rooms[roomId]
        if (!room['readings'][this.category.id]) return
        if (this.readings && this.readings.hasOwnProperty(roomId)) {
          this.DevLog(`chart-detail / Using cached element for ${this.category.id} data for ${roomId}`)
          const dataX = []
          dataX.push(roomId + 'X')
          const dataY = []
          dataY.push(roomId)
          this.dataXs[dataY[0]] = dataX[0]
          this.dataColors[dataY[0]] = room.color
          this.dataNames[dataY[0]] = room.label
          this.readings[roomId].forEach((reading) => {
            dataX.push(reading.time * 1000)
            dataY.push(reading[this.category.id])
          })
          this.data.push(dataX, dataY)
        }
        // TODO
        // else {
        //   this.DevLog(`chart-detail / Loading element from database for ${this.category.id} data for ${roomId}`)
        //   this.loadDataFromFirebase(roomId, currentDatum)
        // }
      })
    },
    generateChart () {
      this.chart = c3.generate({
        bindto: '#' + this.category.id,
        axis: {
          x: {
            type: 'timeseries',
            tick: {
              count: 24,
              fit: true,
              format: '%a %H:%M',
              rotate: 45
            }
          },
          y: {
            label: {
              text: `${this.category.label} (${this.category.unit})`,
              position: 'outer-middle'
            },
            default: [this.category.forceMin, this.category.forceMax]
          }
        },
        data: {
          xs: {
            'cuisine': 'x1',
            'palier': 'x2'
          },
          columns: [
            ['x1', 1530385092 * 1000, 1530386092 * 1000, 1530387092 * 1000, 1530388092 * 1000, 1530389092 * 1000, 1530390092 * 1000],
            ['x2', 1530381600 * 1000, 1530382600 * 1000, 1530383600 * 1000, 1530384600 * 1000, 1530385600 * 1000],
            ['cuisine', 18.2, 19.3, 20.6, 22.8, 23.9, 24.9],
            ['palier', 22, 23.7, 24.8, 29, 31.3]
          ],
          type: 'spline'
        },
        point: {
          show: false,
          r: 1000,
          expand: {
            enabled: false,
            r: 3
          },
          sensitivity: 1000
        },
        size: {
          height: 500
        },
        grid: {
          x: {
            show: true
          },
          y: {
            show: true
          }
        },
        tooltip: {
          grouped: true
        }
      })
      return this.chart
    },
    loadDataAndGraph () {
      this.chart = null
      this.loadData()
      // if (navigator.userAgent.includes('jsdom')) {
      this.generateChart()
      this.chart.load({
        xs: this.dataXs,
        colors: this.dataColors,
        columns: this.data,
        names: this.dataNames,
        unload: true
      })
    }
  },
  mounted () {
    this.loadDataAndGraph()
  }
}
</script>

<style>

</style>
