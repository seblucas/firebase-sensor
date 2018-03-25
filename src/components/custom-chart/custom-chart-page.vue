<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-6 col-md-6">
        <select class="form-control" v-model="selectedCategory">
          <!-- inline object literal -->
          <option v-for="category in categories" v-bind:value="category" :key="category.id">{{ category.label }}</option>
        </select>
        <select class="form-control" v-model="selectedSize">
          <!-- inline object literal -->
          <option v-for="size in chartAllSizes" v-bind:value="size.id" :key="size.id">{{ size.value }}</option>
        </select>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <chart-detail v-if="selectedCategory" :rooms="rooms" :category="selectedCategory" :numberOfHours="selectedSize"></chart-detail>
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
      selectedCategory: null,
      selectedSize: 24,
      chartAllSizes: [
        {id: '24', value: '24 hours'},
        {id: '48', value: '48 hours'},
        {id: '168', value: '1 week'}]
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
