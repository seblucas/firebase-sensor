// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import { store } from './store'
import ObjectToArray from './helper/object2array'
import router from './router'
import Firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

var xmlhttp = new XMLHttpRequest()
var url = '/__/firebase/init.json'

xmlhttp.open('GET', url, false)
xmlhttp.send()
var myArr = JSON.parse(xmlhttp.responseText)
Vue.prototype.$firebase = Firebase.initializeApp(myArr)

Vue.filter('formatDate', (value) => {
  if (value) {
    console.log('FormatDate called ', value)
    return new Date(value * 1000).toLocaleString()
  }
})

Vue.filter('formatNumber', (value, fractionSize) => {
  if (value) {
    console.log('FormatNumber called ', value)
    return value.toLocaleString(undefined, { minimumFractionDigits: fractionSize, maximumFractionDigits: fractionSize })
  }
})

Vue.mixin({
  methods: {
    ObjectToArray
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
