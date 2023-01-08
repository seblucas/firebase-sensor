<template>
  <div >
    <canvas v-bind:id='category.id'></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'

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
              title: {
                display: true,
                text: ''
              },
              ticks: {
                callback: function (value, index, ticks) {
                  return index % 2 === 0 ? new Date(this.getLabelForValue(value) * 1000).toLocaleTimeString() : ''
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
    async loadDataFromFirebase (roomId, startTimestamp, numberOfHours, categoryId) {
      return await this.$store.dispatch('loadDataFromFirebase', { roomId, startTimestamp, numberOfHours, categoryId })
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
          const allData = await this.loadDataFromFirebase(
            roomId,
            this.startTimestamp,
            this.numberOfHours,
            this.category.id
          )
          allData.forEach(data => {
            currentDatum.values.push(data)
          })
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
      const start = new Date(labels[0] * 1000)
      const end = new Date(labels[labels.length - 1] * 1000)
      this.chart.options.scales.x.title.text = start.toLocaleString() + ' - ' + end.toLocaleString()
      this.chart.options.scales.y.title.text = `${this.category.label} (${this.category.unit})`
      this.chart.data.labels = labels
      this.chart.data.datasets = datasets
      this.chart.update()
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
      this.prepareChart()
      await this.loadData()
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
