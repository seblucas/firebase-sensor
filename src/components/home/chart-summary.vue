<template>
  <div>
    <div class="row" v-for="category in categories">
      <div class="col-lg-12">
        <chart-detail v-if="isReadyChart" :rooms="rooms" :category="category" :readings="data"></chart-detail>
      </div>
    </div>
  </div>
</template>

<script>
import ChartDetail from '@/components/home/chart-detail'

export default {
  name: 'chart-summary',
  data () {
    return {
      data: {},
      chartReadyCount: 0,
      numberOfHours: 48
    }
  },
  props: ['rooms', 'categories'],
  computed: {
    isReadyChart () {
      return this.chartReadyCount === Object.keys(this.rooms).length
    }
  },
  methods: {
    loadData () {
      this.data = {}
      this.chartReadyCount = 0
      var lowerTimeLimit = (new Date() / 1000) - 3600 * this.numberOfHours
      Object.keys(this.rooms).forEach((roomId) => {
        console.log('load readings data for room:', roomId)
        this.$firebase.database().ref('readings/' + roomId).limitToLast(4 * this.numberOfHours).once('value', (newValue) => {
          console.log(`found readings for ${roomId}`)

          var basicArray = this.ObjectToArray(newValue.val())
          // Remove too old readings
          basicArray = basicArray.filter((item) => {
            return item.time > lowerTimeLimit
          })
          this.data[roomId] = basicArray
          this.chartReadyCount++
        })
      })
    }
  },
  created () {
    this.loadData()
  },
  components: {ChartDetail: ChartDetail}
}
</script>
