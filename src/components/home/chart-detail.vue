<template>
  <div >
    <canvas v-bind:id='category.id'></canvas>
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
      startTimestamp: 0,
      chartData: {
        type: 'line',
        data: {
          labels: [],
          datasets: []
        },
        options: {
          responsive: true,
          interaction: {
            intersect: false,
            mode: 'index'
          },
          scales: {
            y: {
              title: {
                display: true,
                text: ''
              }
            },
            x: {
              ticks: {
                callback: function (value, index, ticks) {
                  return index % 4 === 0 ? new Date(this.getLabelForValue(value) * 1000).toLocaleTimeString() : ''
                }
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                title: function (context) {
                  const label = new Date(context[0].label * 1000)
                  return label.toLocaleDateString() + ' ' + label.toLocaleTimeString()
                }
              }
            },
            legend: {
              position: 'top'
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
      const queryReadings = query(ref(this.firebaseDatabase, 'readings/' + roomId), limitToLast(4 * (this.numberOfHours + 1)))
      const newValue = await get(queryReadings)
      this.DevLog(`chart-detail / Loaded from database for ${roomId}`)
      let basicArray = this.ObjectToArray(newValue.val())

      basicArray = basicArray.filter((item) => {
        // Remove too old readings and readings with the category
        return item.time > this.startTimestamp &&
          Object.prototype.hasOwnProperty.call(item, this.category.id)
      })
      basicArray.forEach(data => {
        currentDatum.values.push(data)
      })

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
      for (let i = 0; i < ((this.numberOfHours + 1) * 4) + 1; i++) {
        const time = this.startTimestamp + (i * 15 * 60)
        const bottomLimit = time - 15 * 60
        const topLimit = time + 15 * 60
        labels.push(time)
        for (let j = 0; j < this.data.length; j++) {
          const currentDatum = this.data[j]
          const closest = currentDatum.values.filter(i => i.time >= bottomLimit && i.time <= topLimit)
          if (closest.length === 0) {
            datasets[j].data.push(null)
          } else {
            datasets[j].data.push(closest[0][this.category.id])
          }
        }
      }
      this.chartData.options.scales.y.title.text = `${this.category.label} (${this.category.unit})`
      this.chartData.data.labels = labels
      this.chartData.data.datasets = datasets
    },
    generateChart () {
      this.chart = this.chartData
      return this.chart
    },
    prepareChart () {
      if (this.chart) return
      const ctx = document.getElementById(this.category.id)
      this.chart = new Chart(ctx, this.chartData)
    },
    async loadDataAndGraph () {
      const minutes = 60
      const ms = 1000 * 60 * minutes
      this.startTimestamp = (Math.ceil(new Date() / ms) * ms) / 1000 - 3600 * (this.numberOfHours + 1)
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
