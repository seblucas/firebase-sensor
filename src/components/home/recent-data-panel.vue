<template>
  <div class="panel panel-default">
    <div class="panel-body">
      <h2>
        <span class="glyphicon" v-bind:class="room.icon" v-bind:style="{ color: room.color }"></span>
        <span v-for="(category, indexCat) in categories" :key="category.id">
          <span v-if="reading && room.readings[category.id]">
            <span v-if="indexCat > 0"> / </span>
            {{ reading[category.id] | formatNumber(category.fractionSize) }}
            <small>{{ category.unit }}</small>
          </span>
        </span>
      </h2>
    </div>
    <div class="panel-footer">
      <p>{{ room.label }}</p>
      <small v-if="reading">{{ reading.time | formatDate }}  <span v-if='timeLimit > reading.time' class="glyphicon glyphicon-warning-sign text-warning" ></span><br/></small>
    </div>
  </div>
</template>

<script>
import { limitToLast, query, ref, onChildAdded } from 'firebase/database'

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
  created () {
    const lastReadings = query(ref(this.firebaseDatabase, 'readings/' + this.idRoom), limitToLast(1))
    onChildAdded(lastReadings, (newValue) => {
      this.reading = newValue.val()
    })
  }
}
</script>
