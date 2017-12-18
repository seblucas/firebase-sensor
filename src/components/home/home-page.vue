<template>
  <div>
    <recent-data :rooms="rooms" :categories="categories"></recent-data>
    <div class="row" v-for="category in categories">
      <div class="col-lg-12">
        <chart-detail :rooms="rooms" :category="category"></chart-detail>
      </div>
    </div>
  </div>
</template>

<script>
import RecentData from '@/components/home/recent-data'
import ChartDetail from '@/components/home/chart-detail'

export default {
  name: 'home-page',
  computed: {
    rooms () {
      return this.$store.getters.rooms
    },
    categories () {
      return this.$store.getters.categoriesSorted
    }
  },
  components: {RecentData: RecentData, ChartDetail: ChartDetail}
}
</script>
