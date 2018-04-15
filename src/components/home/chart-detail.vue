<template>
  <div v-bind:id="category.id">
    <svg style='height:500px'> </svg>
  </div>
</template>

<script>
import * as d3 from 'd3'
import nv from 'nvd3'

export default {
  name: 'chart-detail',
  data () {
    return {
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
      Object.keys(this.rooms).forEach((roomId) => {
        var room = this.rooms[roomId]
        if (!room['readings'][this.category.id]) return
        var currentDatum = {
          values: [],
          key: room.label,
          color: room.color,
          disabled: false
        }
        this.data.push(currentDatum)
        if (this.readings && this.readings.hasOwnProperty(roomId)) {
          this.DevLog(`chart-detail / Using cached element for ${this.category.id} data for ${roomId}`)
          currentDatum.values = this.readings[roomId]
        } else {
          this.DevLog(`chart-detail / Loading element from database for ${this.category.id} data for ${roomId}`)
          this.loadDataFromFirebase(roomId, currentDatum)
        }
      })
    },
    generateChart () {
      this.chart = nv.models.lineChart()
        .margin({left: 70})
        .useInteractiveGuideline(true)
        // .transitionDuration(350)  //how fast do you want the lines to transition?
        .showLegend(true)
        .xScale(d3.time.scale())
        .interpolate('monotone')
        .x((entry) => { return entry.time })
        .y((entry) => { return entry[this.category.id] })
        .forceY([this.category.forceMin, this.category.forceMax])
        .showYAxis(true)
        .showXAxis(true)

      var tickMultiFormat = d3.time.format.multi([
        ['%H:%M', function (d) { return d.getMinutes() }], // not the beginning of the hour
        ['%a %H:00', function (d) { return d.getHours() }], // not midnight
        ['%b %-d', function (d) { return d.getDate() !== 1 }], // not the first of the month
        ['%b %-d', function (d) { return d.getMonth() }], // not Jan 1st
        ['%Y', function () { return true }]
      ])
      this.chart.xAxis
        .showMaxMin(false)
        .tickFormat(function (d) { return tickMultiFormat(new Date(d * 1000)) })

      this.chart.yAxis
        .axisLabel(`${this.category.label} (${this.category.unit})`)
        .tickFormat(d3.format('.02f'))

      d3.select('#' + this.category.id + ' svg')
        .datum(this.data)
        .call(this.chart)

      nv.utils.windowResize(() => { this.chart.update() })
      return this.chart
    },
    prepareChart () {
      nv.addGraph(() => {
        return this.generateChart()
      })
    },
    loadDataAndGraph () {
      this.loadData()
      this.generateChart()
    }
  },
  mounted () {
    this.loadDataAndGraph()
  }
}
</script>

<style>

</style>
