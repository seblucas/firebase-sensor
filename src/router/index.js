import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/components/home/home-page'
import ErrorPage from '@/components/errors/error-page'
import CustomChartPage from '@/components/custom-chart/custom-chart-page'
import StatisticsPage from '@/components/statistics/statistics-page'

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
    },
    {
      path: '/stats',
      name: 'StatisticsPage',
      component: StatisticsPage // LineChartDetail
    }
  ]
})
