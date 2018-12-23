<template>
  <div>
    <p>
      <button @click="calc3">Generate</button>
    </p>
    <p>
      Start : {{ start }} / Max : {{ max }}
    </p>
    <p>
      Elapsed : {{ Math.floor(elapsed / 60000) }} m {{ Math.floor(elapsed % 60000 / 1000) }} s {{ Math.floor(elapsed % 1000) }} ms ({{ elapsed }}) for {{ Object.keys(this.hashStats).length }}
    </p>
    <p>
      Result
    </p>
    <p v-for="item in stats" :key="item.day">
      {{ item.day }} : {{ item.mean }} / {{ item.min }} / {{ item.min }}
    </p>

  </div>
</template>

<script>

export default {
  name: 'statistics-page',
  data () {
    return {
      start: 0,
      max: 180,
      elapsed: 0,
      stats: [],
      hashStats: {}
    }
  },
  computed: {
    rooms () {
      return this.ObjectToArray(this.$store.getters.rooms)
    },
    categories () {
      return this.$store.getters.categoriesSorted
    }
  },
  methods: {
    normalizeFloat (maybeString) {
      if (typeof (maybeString) === 'string') {
        return parseFloat(maybeString)
      }
      return maybeString
    },
    async calc3 () {
      this.hashStats = {}
      let timeStart = new Date(2015, 10, 1, 0, 0, 1).getTime() / 1000
      // const categories = [ 'temp', 'hum' ]
      this.start = 0
      const t0 = performance.now()
      while (this.start < this.max) {
        const timeEnd = timeStart + 86399
        for (let room of this.rooms) {
          let ref = this.$firebase.database().ref('readings/' + room.id).orderByChild('time')
          ref = ref.startAt(timeStart)
          ref = ref.endAt(timeEnd)
          const data = await ref.once('value')
          const key = room.id + '_' + new Date((timeStart + 43200) * 1000).toISOString().substring(0, 10)
          if (data.exists()) {
            // console.log(data.val())
            var basicArray = this.ObjectToArray(data.val())

            if (basicArray.length > 64) {
              if (!this.hashStats.hasOwnProperty(key)) {
                this.hashStats[key] = {
                  time: timeStart + 43200
                }
              }
              this.categories.forEach(category => {
                const cat = category.id
                if (!room.readings.hasOwnProperty(cat) ||
                  room.readings[cat] === 0) {
                  return
                }
                const dataCat = basicArray.map(i => this.normalizeFloat(i[cat]))

                this.hashStats[key][cat] = dataCat.reduce((s, i) => s + i, 0) / dataCat.length
                this.hashStats[key][cat + '_min'] = Math.min(...dataCat)
                this.hashStats[key][cat + '_max_'] = Math.max(...dataCat)
                this.hashStats[key][cat + '_count'] = dataCat.length
              })
            }
          } else {
            console.log('nothing found for ', key)
          }
        }
        timeStart += 86400
        this.start++
      }
      this.elapsed = performance.now() - t0
    }
  }
}
</script>
