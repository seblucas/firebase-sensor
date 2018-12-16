import Vue from 'vue'
import App from './App.vue'
import { store } from './store'
import ObjectToArray from './helper/object2array'
import DevLog from './helper/devLog'
import router from './router'
import Firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import './registerServiceWorker'
import 'nvd3/build/nv.d3.css'

var url = '/__/firebase/init.json'
if (process.env.NODE_ENV === 'development') {
  url = '/init.json'
}

Vue.filter('formatDate', (value) => {
  if (value) {
    return new Date(value * 1000).toLocaleString()
  }
})

Vue.filter('formatNumber', (value, fractionSize) => {
  if (value) {
    return value.toLocaleString(undefined, { minimumFractionDigits: fractionSize, maximumFractionDigits: fractionSize })
  }
})

Vue.mixin({
  methods: {
    ObjectToArray,
    DevLog
  }
})

Vue.config.productionTip = false

fetch(url).then(response => {
  response.json().then(auth => {
    Vue.prototype.$firebase = Firebase.initializeApp(auth)

    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  })
})
