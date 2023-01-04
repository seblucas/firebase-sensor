<template>
    <div id="app" v-bind:class="[fluid ? 'container-fluid' : 'container']">
      <nav class="navbar navbar-default">
        <div class="container-fluid">
          <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#menu-1" aria-expanded="false">
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <router-link class="navbar-brand" :to="{ name: 'HomePage'}">Capteurs</router-link>
          </div>
          <div class="collapse navbar-collapse" id="menu-1">
            <ul class="nav navbar-nav navbar-right">
              <li><a href="#" target="_self" v-on:click="toggleHZoom()"><span class="glyphicon glyphicon-resize-horizontal"></span></a></li>
              <li><router-link :to="{ name: 'LineChartPage'}"><span class="glyphicon glyphicon-signal"></span></router-link></li>
              <li><router-link :to="{ name: 'ErrorListPage'}"><span class="badge progress-bar-danger">{{ errors.length }}</span></router-link></li>
              <li class="dropdown">
                <a href="#" class="dropdown-toggle" target="_self" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><span class="glyphicon glyphicon-user"></span> <span class="caret"></span></a>
                <ul class="dropdown-menu">
                  <li v-if="!authData"><a href="#" target="_self" v-on:click="$store.dispatch('login')">Log In</a></li>
                  <li v-if="authData"><a href="#" target="_self">Uid {{ authData.uid }}</a></li>
                  <li v-if="authData"><a href="#" target="_self">Logged as {{ authData.providerData[0].displayName }}</a></li>
                  <li v-if="authData"><a href="#" target="_self" v-on:click="$store.dispatch('logout')">Log Out</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div class="row">
        <div class="col-xs-12">
          <div class="alert alert-warning" role="alert" v-if="!authData">
            Please Log in to use this page. <span v-if="statusLoaded">Status : {{ status }}</span>
          </div>
        </div>
      </div>
      <div v-if="rooms && errors && categories">
        <router-view/>
      </div>
      <div class="visible-xs hidden-sm hidden-md hidden-lg">xs</div>
      <div class="hidden-xs visible-sm hidden-md hidden-lg">sm</div>
      <div class="hidden-xs hidden-sm visible-md hidden-lg">md</div>
      <div class="hidden-xs hidden-sm hidden-md visible-lg">lg</div>
    </div>
</template>

<script>
import { ref, get, query, limitToLast } from 'firebase/database'

export default {
  name: 'app',
  data () {
    return {
      fluid: false,
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
    async initData () {
      Object.keys(this.statusData).forEach(async (roomId) => {
        const lastReadings = query(ref(this.firebaseDatabase, 'readings/' + roomId), limitToLast(1))
        const newValue = await get(lastReadings)
        const myArray = this.ObjectToArray(newValue.val())
        this.statusData[roomId] = myArray[0].time
      })
      console.log(this.statusData)
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
// @import 'nvd3/build/nv.d3.css';
</style>
