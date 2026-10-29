import { createStore } from 'vuex'
import { state, mutations, actions, getters } from './default'

export const store = createStore({
  state,
  mutations,
  actions,
  getters
})
