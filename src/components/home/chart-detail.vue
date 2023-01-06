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
          interaction: {
            intersect: false,
            mode: 'index'
          },
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
    async loadDataFromFirebase (roomId, currentDatum) {
      const lowerTimeLimit = (new Date() / 1000) - 3600 * this.numberOfHours
      const queryReadings = query(ref(this.firebaseDatabase, 'readings/' + roomId), limitToLast(4 * this.numberOfHours))
      const newValue = await get(queryReadings)
      this.DevLog(`chart-detail / Loaded from database for ${roomId}`)
      let basicArray = this.ObjectToArray(newValue.val())

      basicArray = basicArray.filter((item) => {
        // Remove too old readings and readings with the category
        return item.time > lowerTimeLimit &&
          Object.prototype.hasOwnProperty.call(item, this.category.id)
      })
      basicArray.forEach(data => {
        currentDatum.values.push(data)
      })
      console.log(roomId, 'Fini', currentDatum.values.length)

      // if (this.chart) {
      //   this.chart.update()
      // }
    },
    async loadData () {
      this.data = []
      const roomKeys = Object.keys(this.rooms)
      for (let i = 0; i < roomKeys.length; i++) {
        const roomId = roomKeys[i]
        const room = this.rooms[roomId]
        if (!room.readings[this.category.id]) continue
        const currentDatum = {
          values: [],
          label: room.label,
          borderColor: room.color,
          hidden: false
        }
        this.data.push(currentDatum)
        if (this.readings && Object.prototype.hasOwnProperty.call(this.readings, roomId)) {
          this.DevLog(`chart-detail / Using cached element for ${this.category.id} data for ${roomId}`)
          currentDatum.values = this.readings[roomId].filter(item => Object.prototype.hasOwnProperty.call(item, this.category.id))
          if (currentDatum.values.length === 0) {
            currentDatum.hidden = true
          }
        } else {
          this.DevLog(`chart-detail / Loading element from database for ${this.category.id} data for ${roomId}`)
          await this.loadDataFromFirebase(roomId, currentDatum)
        }
      }
      this.updateData()
    },
    updateData () {
      const labels = []
      const datasets = []
      const lowerTimeLimit = Math.floor(new Date() / 1000) - 3600 * this.numberOfHours
      this.data.forEach((dataset) => {
        datasets.push({
          data: [],
          label: dataset.label,
          borderColor: dataset.borderColor,
          borderWidth: 1,
          pointStyle: false,
          hidden: dataset.hidden
        })
      })
      for (let i = 0; i < this.numberOfHours * 4; i++) {
        const time = lowerTimeLimit + (i * 15 * 60)
        const bottomLimit = time - 15 * 60
        const topLimit = time + 15 * 60
        labels.push(time)
        for (let j = 0; j < this.data.length; j++) {
          const currentDatum = this.data[j]
          // console.log(currentDatum.label, currentDatum.values, currentDatum.values.length)
          const closest = currentDatum.values.filter(i => i.time >= bottomLimit && i.time <= topLimit)
          console.log(currentDatum, bottomLimit, topLimit)
          if (closest.length === 0) {
            datasets[j].data.push(null)
          } else {
            datasets[j].data.push(closest[0][this.category.id])
          }
        }
      }
      this.planetChartData.data.labels = labels
      this.planetChartData.data.datasets = datasets
    },
    generateChart () {
      this.chart = this.planetChartData
      return this.chart
    },
    prepareChart () {
      const ctx = document.getElementById('planet-chart')
      this.chart = new Chart(ctx, this.planetChartData)
    },
    async loadDataAndGraph () {
      this.chart = null
      await this.loadData()
      if (navigator.userAgent.includes('jsdom')) {
        this.generateChart()
      } else {
        this.prepareChart()
      }
    }
  },
  async mounted () {
    Chart.overrides.line.spanGaps = true
    await this.loadDataAndGraph()
  }
}
</script>

<style>

</style>
