<template>
  <div>
    <div class="row">
        <div class="col-lg-12">
          <button class="btn btn-default pull-right" v-on:click="loadData()"><span class="glyphicon glyphicon-refresh"></span></button>
        </div>
    </div>
    <div class="row" v-for="category in categories" :key="category.id">
      <div class="col-lg-12">
        <chart-detail v-if="isReadyChart" :rooms="rooms" :category="category" :readings="data" :numberOfHours="numberOfHours"></chart-detail>
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
      numberOfHours: 24
    }
  },
  props: ['rooms', 'categories'],
  computed: {
    isReadyChart () {
      return this.chartReadyCount === Object.keys(this.rooms).length
    }
  },
  methods: {
    async loadDataFromFirebase (roomId, startTimestamp, numberOfHours, categoryId) {
      return await this.$store.dispatch('loadDataFromFirebase', { roomId, startTimestamp, numberOfHours, categoryId })
    },
    async loadData () {
      this.data = {}
      this.chartReadyCount = 0
      const minutes = 60
      const ms = 1000 * 60 * minutes
      const startTimestamp = (Math.ceil(new Date() / ms) * ms) / 1000 - 3600 * (this.numberOfHours + 1)
      Object.keys(this.rooms).forEach(async (roomId) => {
        this.data[roomId] = await this.loadDataFromFirebase(
          roomId,
          startTimestamp,
          this.numberOfHours,
          false
        )
        this.chartReadyCount++
      })
    }
  },
  created () {
    this.loadData()
  },
  components: { ChartDetail: ChartDetail }
}
</script>
