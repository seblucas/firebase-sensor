<template>
    <div id="app" :class="fluid ? 'container-fluid' : 'container'">
      <nav class="navbar navbar-expand-lg bg-body-tertiary rounded">
        <div class="container-fluid">
          <router-link class="navbar-brand" :to="{ name: 'HomePage' }" @click="closeNavigation">Capteurs</router-link>
          <button
            class="navbar-toggler"
            type="button"
            aria-controls="main-menu"
            aria-label="Toggle navigation"
            :aria-expanded="navMenuOpen"
            @click="navMenuOpen = !navMenuOpen"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div id="main-menu" class="collapse navbar-collapse" :class="{ show: navMenuOpen }">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
              <li class="nav-item">
                <button class="nav-link" type="button" aria-label="Toggle full width" @click="toggleHZoom(); closeNavigation()">
                  <i class="bi bi-arrows-angle-expand" aria-hidden="true"></i>
                </button>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" :to="{ name: 'LineChartPage' }" aria-label="Charts" @click="closeNavigation">
                  <i class="bi bi-graph-up" aria-hidden="true"></i>
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" :to="{ name: 'ErrorListPage' }" aria-label="Errors" @click="closeNavigation">
                  <span class="badge text-bg-danger">{{ errors.length }}</span>
                </router-link>
              </li>
              <li class="nav-item dropdown">
                <button
                  class="nav-link dropdown-toggle"
                  type="button"
                  aria-haspopup="true"
                  :aria-expanded="accountMenuOpen"
                  @click="accountMenuOpen = !accountMenuOpen"
                >
                  <i class="bi bi-person" aria-hidden="true"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end" :class="{ show: accountMenuOpen }">
                  <li v-if="!authData">
                    <button class="dropdown-item" type="button" @click="dispatchAccountAction('login')">Log In</button>
                  </li>
                  <li v-if="authData"><span class="dropdown-item-text">Uid {{ authData.uid }}</span></li>
                  <li v-if="authData"><span class="dropdown-item-text">Logged as {{ authData.providerData[0].displayName }}</span></li>
                  <li v-if="authData">
                    <button class="dropdown-item" type="button" @click="dispatchAccountAction('logout')">Log Out</button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div class="row">
        <div class="col-12">
          <div class="alert alert-warning" role="alert" v-if="!authData">
            Please Log in to use this page. <span v-if="statusLoaded">Status : {{ status }}</span>
          </div>
        </div>
      </div>
      <div v-if="rooms && errors && categories">
        <router-view/>
      </div>
      <div class="d-block d-md-none">xs</div>
      <div class="d-none d-md-block d-lg-none">sm</div>
      <div class="d-none d-lg-block d-xl-none">md</div>
      <div class="d-none d-xl-block">lg</div>
    </div>
</template>

<script>
import { ref, get, query, limitToLast } from 'firebase/database'

export default {
  name: 'app',
  data () {
    return {
      fluid: false,
      navMenuOpen: false,
      accountMenuOpen: false,
      tstamp: 0,
      statusLoaded: false,
      statusData: {
        grenier: 0,
        palier: 0,
        deulemont: 0,
        cuisine: 0
      }
    }
  },
  computed: {
    authData () {
      return this.$store.getters.user
    },
    rooms () {
      return this.$store.getters.rooms
    },
    errors () {
      return this.$store.getters.errors
    },
    categories () {
      return this.$store.getters.categories
    },
    firebaseDatabase () {
      return this.$store.getters.firebaseDatabase
    },
    status () {
      if (this.authData) return 'Connected'
      let error = 0
      Object.keys(this.statusData).forEach((roomId) => {
        if (this.tstamp - this.statusData[roomId] > 31 * 60) error = error + 1
      })
      if (error > 0) return error + ' sensor failed'
      return 'Everything is up'
    }
  },
  methods: {
    toggleHZoom () {
      this.fluid = !this.fluid
    },
    closeNavigation () {
      this.navMenuOpen = false
      this.accountMenuOpen = false
    },
    dispatchAccountAction (action) {
      this.$store.dispatch(action)
      this.closeNavigation()
    },
    async initData () {
      Object.keys(this.statusData).forEach(async (roomId) => {
        const lastReadings = query(ref(this.firebaseDatabase, 'readings/' + roomId), limitToLast(1))
        const newValue = await get(lastReadings)
        const myArray = this.ObjectToArray(newValue.val())
        this.statusData[roomId] = myArray[0].time
      })
    }

  },
  beforeCreate () {
    this.$store.commit('setFirebaseApp', this.$firebase)
    this.$store.dispatch('listenForAuthentication')
  },
  async mounted () {
    this.tstamp = Math.floor(Date.now() / 1000)
    await this.initData()
    this.statusLoaded = true
  }
}
</script>

<style lang="scss">
</style>
