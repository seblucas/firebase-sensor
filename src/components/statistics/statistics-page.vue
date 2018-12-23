<template>
  <div>
    <p>
      <button @click="calc3">Generate</button>
    </p>
    <p>
      Start : {{ start }} / Max : {{ max }}
    </p>
    <p>
      Elapsed : {{ Math.floor(elapsed / 1000) }} s {{ Math.floor(elapsed % 1000) }} ms ({{ elapsed }}) for {{ Object.keys(this.hashStats).length }}
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
      blockSize: 10,
      elapsed: 0,
      stats: [],
      hashStats: {}
    }
  },
  computed: {
  },
  methods: {
    normalizeFloat (maybeString) {
      if (typeof (maybeString) === 'string') {
        return parseFloat(maybeString)
      }
      return maybeString
    },
    async calc () {
      let oldId = null
      while (this.start < 101) {
        let ref = this.$firebase.database().ref('readings/palier').orderByKey()
        if (oldId) {
          ref = ref.startAt(oldId)
        }
        const data = await ref.limitToFirst(this.blockSize).once('value')
        console.log(oldId, data.val())
        var basicArray = this.ObjectToArray(data.val())
        basicArray.forEach(element => {
          const key = new Date(element.time * 1000).toISOString().substring(0, 10)
          if (!this.hashStats.hasOwnProperty(key)) {
            this.hashStats[key] = {
              sumtemp: 0.0,
              counttemp: 0,
              sumhum: 0.0,
              counthum: 0
            }
          }
          ['temp', 'hum'].forEach(cat => {
            this.hashStats[key]['sum' + cat] += this.normalizeFloat(element[cat])
            this.hashStats[key]['count' + cat] += 1
          })
          // oldId = element.id
        })
        oldId = basicArray[this.blockSize - 1].id
        this.start += this.blockSize
      }
    },
    async calc2 () {
      let ref = this.$firebase.database().ref('readings/palier').orderByChild('time')
      ref = ref.startAt(1480546800)
      ref = ref.endAt(1483225199)
      const data = await ref.once('value')
      console.log(data.val())
      var basicArray = this.ObjectToArray(data.val())
      basicArray.forEach(element => {
        const key = new Date(element.time * 1000).toISOString().substring(0, 10)
        if (!this.hashStats.hasOwnProperty(key)) {
          this.hashStats[key] = {
            sumtemp: 0.0,
            counttemp: 0,
            sumhum: 0.0,
            counthum: 0
          }
        }
        ['temp', 'hum'].forEach(cat => {
          this.hashStats[key]['sum' + cat] += this.normalizeFloat(element[cat])
          this.hashStats[key]['count' + cat] += 1
        })
      })
    },
    async calc3 () {
      this.hashStats = {}
      let timeStart = new Date(2015, 10, 1, 0, 0, 1).getTime() / 1000
      const categories = [ 'temp', 'hum' ]
      this.start = 0
      const t0 = performance.now()
      while (this.start < this.max) {
        const timeEnd = timeStart + 86399

        let ref = this.$firebase.database().ref('readings/palier').orderByChild('time')
        ref = ref.startAt(timeStart)
        ref = ref.endAt(timeEnd)
        const data = await ref.once('value')
        if (data.exists()) {
          console.log(data.val())
          var basicArray = this.ObjectToArray(data.val())
          const key = new Date((timeStart + 43200) * 1000).toISOString().substring(0, 10)

          if (basicArray.length > 64) {
            categories.forEach(cat => {
              const dataCat = basicArray.map(i => this.normalizeFloat(i[cat]))
              if (!this.hashStats.hasOwnProperty(key)) {
                this.hashStats[key] = {
                  time: timeStart + 43200
                }
              }
              this.hashStats[key][cat] = dataCat.reduce((s, i) => s + i, 0) / dataCat.length
              this.hashStats[key][cat + '_min'] = Math.min(...dataCat)
              this.hashStats[key][cat + '_max_'] = Math.max(...dataCat)
              this.hashStats[key][cat + '_count'] = dataCat.length
            })
          }
        } else {
          console.log('nothing found')
        }
        timeStart += 86400
        this.start++
      }
      this.elapsed = performance.now() - t0
    }
  }
}
</script>
