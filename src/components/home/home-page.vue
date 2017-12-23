<template>
  <div>
    <recent-data :rooms="rooms" :categories="categories"></recent-data>
    <chart-summary :rooms="rooms" :categories="categories"></chart-summary>
  </div>
</template>

<script>
import RecentData from '@/components/home/recent-data'
import ChartSummary from '@/components/home/chart-summary'

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
  components: {RecentData: RecentData, ChartSummary: ChartSummary}
}
</script>
