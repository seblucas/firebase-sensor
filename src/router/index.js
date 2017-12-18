import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/home/home-page'
import ErrorPage from '@/components/errors/error-page'
import CustomChartPage from '@/components/custom-chart/custom-chart-page'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage // HomePage
    },
    {
      path: '/errors',
      name: 'ErrorListPage',
      component: ErrorPage // readingsErrors
    },
    {
      path: '/line-chart',
      name: 'LineChartPage',
      component: CustomChartPage // LineChartDetail
    }
  ]
})
