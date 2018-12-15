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
            Please Log in to use this page
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

export default {
  name: 'app',
  data () {
    return {
      fluid: false
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
    }
  },
  methods: {
    toggleHZoom () {
      this.fluid = !this.fluid
    }
  },
  beforeCreate () {
    this.$store.dispatch('listenForAuthentication')
  }
}
</script>

<style lang="scss">
// @import 'nvd3/build/nv.d3.css';
</style>
