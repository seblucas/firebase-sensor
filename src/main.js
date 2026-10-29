import { createApp } from 'vue'
import App from './App.vue'
import { store } from './store'
import ObjectToArray from './helper/object2array'
import DevLog from './helper/devLog'
import { formatDate, formatNumber } from './helper/format'
import router from './router'
import { initializeApp } from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import './registerServiceWorker'

let url = '/__/firebase/init.json'
if (process.env.NODE_ENV === 'development') {
  url = '/init.json'
}

fetch(url).then(response => {
  response.json().then(auth => {
    const app = createApp(App)
    app.config.globalProperties.$firebase = initializeApp(auth)
    app.config.globalProperties.ObjectToArray = ObjectToArray
    app.config.globalProperties.DevLog = DevLog
    app.config.globalProperties.formatDate = formatDate
    app.config.globalProperties.formatNumber = formatNumber
    app.use(router)
    app.use(store)
    app.mount('#app')
  })
})
