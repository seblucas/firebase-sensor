<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-6 col-md-6">
        <select class="form-control" v-model="selectedCategory">
          <!-- inline object literal -->
          <option v-for="category in categories" v-bind:value="category">{{ category.label }}</option>
        </select>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <chart-detail v-if="selectedCategory" :rooms="rooms" :category="selectedCategory"></chart-detail>
      </div>
    </div>
  </div>
</template>

<script>
import ChartDetail from '@/components/home/chart-detail'

export default {
  name: 'custom-chart-page',
  data () {
    return {
      selectedCategory: null
    }
  },
  computed: {
    rooms () {
      return this.$store.getters.rooms
    },
    categories () {
      return this.$store.getters.categoriesSorted
    }
  },
  components: {ChartDetail: ChartDetail}
}
</script>
