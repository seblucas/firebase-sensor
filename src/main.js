import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
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

const url = import.meta.env.DEV ? '/init.json' : '/__/firebase/init.json'

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
