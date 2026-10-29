import ObjectToArray from '@/helper/object2array'
import DevLog from '../../mocks/devLog.mock'
import { formatDate, formatNumber } from '@/helper/format'

export default function testGlobalOptions (store) {
  return {
    plugins: store ? [store] : [],
    mocks: {
      ObjectToArray,
      DevLog,
      formatDate,
      formatNumber
    },
    stubs: {
      RouterLink: true,
      RouterView: true
    }
  }
}
