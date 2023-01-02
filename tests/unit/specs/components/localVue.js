import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'

export default function genlocalVue () {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  localVue.filter('formatDate', (value) => {
    if (value) {
      return new Date(value * 1000).toLocaleString('en-US')
    }
  })
  localVue.filter('formatNumber', (value, fractionSize) => {
    if (value) {
      return value.toLocaleString(undefined, { minimumFractionDigits: fractionSize, maximumFractionDigits: fractionSize })
    }
  })
  return localVue
}
