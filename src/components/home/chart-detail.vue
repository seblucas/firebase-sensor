<template>
  <div v-bind:id='category.id'>
    <canvas id='planet-chart'></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'
import { ref, query, get, limitToLast } from 'firebase/database'

export default {
  name: 'chart-detail',
  data () {
    return {
      data: [],
      chart: null,
      planetChartData: {
        type: 'line',
        data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [{
            label: 'consigne',
            data: [12, 19, 3, 5, 2, 3],
            borderColor: '#F44336',
            borderWidth: 1
          },
          {
            label: 'grenier',
            data: [13, 18, 2, 17, 1, 8],
            borderColor: '#CCCCCC',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top'
            },
            title: {
              display: true,
              text: 'Chart.js Line Chart'
            }
          }
        }
      }
    }
  },
  props: ['rooms', 'category', 'readings', 'numberOfHours'],
  computed: {
    firebaseDatabase () {
      return this.$store.getters.firebaseDatabase
    }
  },
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
      const lowerTimeLimit = (new Date() / 1000) - 3600 * this.numberOfHours
      const queryReadings = query(ref(this.firebaseDatabase, 'readings/' + roomId), limitToLast(4 * this.numberOfHours))
      get(queryReadings).then((newValue) => {
        this.DevLog(`chart-detail / Loaded from database for ${roomId}`)
        const basicArray = this.ObjectToArray(newValue.val())

        currentDatum.values = basicArray.filter((item) => {
          // Remove too old readings and readings with the category
          return item.time > lowerTimeLimit &&
            Object.prototype.hasOwnProperty.call(item, this.category.id)
        })
        if (this.chart) {
          this.chart.update()
        }
      })
    },
    loadData () {
      this.data = []
      Object.keys(this.rooms).forEach((roomId) => {
        const room = this.rooms[roomId]
        if (!room.readings[this.category.id]) return
        const currentDatum = {
          values: [],
          key: room.label,
          color: room.color,
          disabled: false
        }
        this.data.push(currentDatum)
        if (this.readings && Object.prototype.hasOwnProperty.call(this.readings, roomId)) {
          this.DevLog(`chart-detail / Using cached element for ${this.category.id} data for ${roomId}`)
          currentDatum.values = this.readings[roomId].filter(item => Object.prototype.hasOwnProperty.call(item, this.category.id))
          if (currentDatum.values.length === 0) {
            currentDatum.disabled = true
          }
        } else {
          this.DevLog(`chart-detail / Loading element from database for ${this.category.id} data for ${roomId}`)
          this.loadDataFromFirebase(roomId, currentDatum)
        }
      })
    },
    generateChart () {
      this.chart = this.planetChartData
      return this.chart
    },
    prepareChart () {
      const ctx = document.getElementById('planet-chart')
      this.chart = new Chart(ctx, this.planetChartData)
    },
    loadDataAndGraph () {
      this.chart = null
      this.loadData()
      if (navigator.userAgent.includes('jsdom')) {
        this.generateChart()
      } else {
        this.prepareChart()
      }
    }
  },
  mounted () {
    this.loadDataAndGraph()
  }
}
</script>

<style>

</style>
