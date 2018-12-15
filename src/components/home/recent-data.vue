<template>
  <div class="row">
    <div class="col-xs-12 col-sm-6 col-md-4" v-for="(room, idRoom) in rooms" :key="idRoom">
      <recent-data-panel :room="room" :id-room="idRoom" :categories="categories" :time-limit="currentTimeLimit"></recent-data-panel>
    </div>
  </div>
</template>

<script>
import RecentDataPanel from '@/components/home/recent-data-panel'

export default {
  name: 'recent-data',
  data () {
    return {
      currentTimeLimit: Math.floor(Date.now() / 1000) - (31 * 60)
    }
  },
  props: ['rooms', 'categories'],
  components: { RecentDataPanel: RecentDataPanel },
  mounted () {
    this.interval = setInterval(() => {
      this.currentTimeLimit = Math.floor(Date.now() / 1000) - (31 * 60)
    }, 1 * 60 * 1000)
  },
  beforeDestroy () {
    clearInterval(this.interval)
  }
}
</script>
