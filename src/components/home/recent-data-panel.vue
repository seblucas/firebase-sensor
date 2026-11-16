<template>
  <div class="card mb-3">
    <div class="card-body">
      <h2>
        <i :class="bootstrapIconClass(room.icon)" :style="{ color: room.color }" aria-hidden="true"></i>
        <span v-for="(category, indexCat) in categories" :key="category.id">
          <span v-if="reading && room.readings[category.id]">
            <span v-if="indexCat > 0"> / </span>
            {{ formatNumber(reading[category.id], category.fractionSize) }}
            <small>{{ category.unit }}</small>
          </span>
        </span>
      </h2>
    </div>
    <div class="card-footer">
      <p>{{ room.label }}</p>
      <small v-if="reading">{{ formatDate(reading.time) }}  <i v-if="timeLimit > reading.time" class="bi bi-exclamation-triangle text-warning" aria-label="Reading is out of date"></i><br/></small>
    </div>
  </div>
</template>

<script>
import { limitToLast, query, ref, onChildAdded } from 'firebase/database'
import { bootstrapIconClass } from '@/helper/bootstrapIcon'

export default {
  name: 'recent-data-panel',
  props: ['room', 'idRoom', 'categories', 'timeLimit'],
  computed: {
    firebaseDatabase () {
      return this.$store.getters.firebaseDatabase
    }
  },
  data () {
    return {
      reading: false
    }
  },
  methods: {
    bootstrapIconClass
  },
  created () {
    const lastReadings = query(ref(this.firebaseDatabase, 'readings/' + this.idRoom), limitToLast(1))
    onChildAdded(lastReadings, (newValue) => {
      this.reading = newValue.val()
    })
  }
}
</script>
