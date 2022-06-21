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
      year: 2018,
      months: [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12'
      ],
      start: 0,
      max: 31,
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
      if (maybeString === undefined || maybeString === null) {
        return null
      }
      if (typeof (maybeString) === 'string') {
        return parseFloat(maybeString)
      }
      return maybeString
    },
    appendValue (dataObject, key, value) {
      if (!Object.prototype.hasOwnProperty.call(dataObject, key)) {
        dataObject[key] = []
      }
      dataObject[key].push(value)
    },
    async processMonthlyStats () {
      await this.$firebase.database().ref('stats_monthly/' + this.year.toString()).remove()
      await this.$firebase.database().ref('stats_yearly/' + this.year.toString()).remove()
      for (const room of this.rooms) {
        const yearlyData = {
          time: new Date(this.year, 0, 1, 0, 0, 0).getTime() / 1000 + 43200
        }
        const tempYearlyData = {}
        for (const month of this.months) {
          const data = this.hashStats[room.id][month]
          if (data.length === 0) {
            continue
          }
          const dataObject = {
            time: new Date(this.year, month - 1, 1, 0, 0, 0).getTime() / 1000 + 43200
          }
          this.categories.forEach(category => {
            const cat = category.id
            if (!Object.prototype.hasOwnProperty.call(room.readings, cat) ||
              room.readings[cat] === 0) {
              return
            }
            const dataAvg = data.filter(i => Object.prototype.hasOwnProperty.call(i, cat)).map(i => this.normalizeFloat(i[cat]))
            const dataMin = data.filter(i => Object.prototype.hasOwnProperty.call(i, cat + '_min')).map(i => this.normalizeFloat(i[cat + '_min']))
            const dataMax = data.filter(i => Object.prototype.hasOwnProperty.call(i, cat + '_max')).map(i => this.normalizeFloat(i[cat + '_max']))
            if (dataAvg.length < 15) {
              return
            }

            dataObject[cat] = dataAvg.reduce((s, i) => s + i, 0) / dataAvg.length
            this.appendValue(tempYearlyData, cat, dataObject[cat])

            dataObject[cat + '_min'] = Math.min(...dataMin)
            this.appendValue(tempYearlyData, cat + '_min', dataObject[cat + '_min'])
            dataObject[cat + '_max'] = Math.max(...dataMax)
            this.appendValue(tempYearlyData, cat + '_max', dataObject[cat + '_max'])
          })
          if (Object.keys(dataObject).length > 1) {
            dataObject.month = month
            const newItem = await this.$firebase.database().ref('stats_monthly/' + this.year.toString() + '/' + room.id).push(dataObject)
            console.log('New monthly item added ', newItem.key)
          }
        }
        this.categories.forEach(category => {
          const cat = category.id
          if (!Object.prototype.hasOwnProperty.call(tempYearlyData, cat)) {
            return
          }
          const itemNumber = tempYearlyData[cat].length
          yearlyData[cat] = tempYearlyData[cat].reduce((s, i) => s + i, 0) / itemNumber
          yearlyData[cat + '_min'] = Math.min(...tempYearlyData[cat + '_min'])
          yearlyData[cat + '_max'] = Math.max(...tempYearlyData[cat + '_max'])
        })
        if (Object.keys(yearlyData).length > 1) {
          const newItem = await this.$firebase.database().ref('stats_yearly/' + this.year.toString() + '/' + room.id).push(yearlyData)
          console.log('New yearly item added ', newItem.key)
        }
      }
    },
    calcDailyStats (room, basicArray, dataObject) {
      this.categories.forEach(category => {
        const cat = category.id
        if (!Object.prototype.hasOwnProperty.call(room.readings, cat) ||
          room.readings[cat] === 0) {
          return
        }
        const dataCat = basicArray.filter(i => Object.prototype.hasOwnProperty.call(i, cat)).map(i => this.normalizeFloat(i[cat]))
        if (dataCat.length < 65) {
          return
        }

        dataObject[cat] = dataCat.reduce((s, i) => s + i, 0) / dataCat.length
        dataObject[cat + '_min'] = Math.min(...dataCat)
        dataObject[cat + '_max'] = Math.max(...dataCat)
        dataObject[cat + '_count'] = dataCat.length
      })
    },
    async calc3 () {
      this.hashStats = {}
      await this.$firebase.database().ref('stats_daily/' + this.year.toString()).remove()
      for (const room of this.rooms) {
        this.hashStats[room.id] = {
          '01': [],
          '02': [],
          '03': [],
          '04': [],
          '05': [],
          '06': [],
          '07': [],
          '08': [],
          '09': [],
          10: [],
          11: [],
          12: []
        }
      }
      let timeStart = new Date(this.year, 0, 1, 0, 0, 0).getTime() / 1000
      this.start = 0
      this.elapsed = 0
      const t0 = performance.now()
      let currentYear = this.year
      while (currentYear === this.year) {
        const timeEnd = timeStart + 86399
        for (const room of this.rooms) {
          if (room.id === 'consigne') {
            continue
          }
          let ref = this.$firebase.database().ref('readings/' + room.id).orderByChild('time')
          ref = ref.startAt(timeStart)
          ref = ref.endAt(timeEnd)
          const data = await ref.once('value')
          const key = room.id + '-' + new Date((timeStart + 43200) * 1000).toISOString().substring(0, 10)
          if (data.exists()) {
            var basicArray = this.ObjectToArray(data.val())
            var keyElements = key.split('-')
            console.log('elem', keyElements)
            const dataObject = {
              time: timeStart + 43200
            }
            this.calcDailyStats(room, basicArray, dataObject)
            this.hashStats[keyElements[0]][keyElements[2]].push(dataObject)
            if (basicArray.length > 64) {
              const newItem = await this.$firebase.database().ref('stats_daily/' + this.year.toString() + '/' + room.id).push(dataObject)
              console.log('New daily item added ', newItem.key)
            }
          } else {
            console.log('nothing found for ', key)
          }
        }
        this.elapsed = performance.now() - t0
        timeStart += 86400
        currentYear = new Date((timeStart + 43200) * 1000).getFullYear()
        this.start++
      }
      await this.processMonthlyStats()
      this.elapsed = performance.now() - t0
    }
  }
}
</script>
