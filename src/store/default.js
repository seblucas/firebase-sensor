import Firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import ObjectToArray from '@/helper/object2array'
import devLog from '@/helper/devLog'

export const state = {
  user: null,
  rooms: false,
  categories: false,
  errors: []
}

export const mutations = {
  setUser (state, payload) {
    state.user = payload
  },
  setRooms (state, payload) {
    state.rooms = payload
  },
  setCategories (state, payload) {
    state.categories = payload
  },
  setErrors (state, payload) {
    state.errors = payload
  }
}

export const actions = {
  listenForAuthentication ({ dispatch, commit }) {
    Firebase.auth().onAuthStateChanged((authData) => {
      if (authData) {
        devLog('Logged in as:', authData.uid)
        commit('setUser', authData)
        dispatch('loadRooms')
        dispatch('loadCategories')
        dispatch('loadErrors')
      } else {
        devLog('Logged out')
        commit('setUser', null)
        commit('setRooms', null)
        commit('setCategories', null)
        commit('setErrors', [])
      }
    })
  },
  login () {
    const provider = new Firebase.auth.GoogleAuthProvider()
    Firebase.auth().signInWithPopup(provider).then(() => {
      // No need to do anything here it's handled by $onAuthStateChanged
    }).catch((error) => {
      console.error('Authentication failed:', error)
    })
  },
  logout () {
    Firebase.auth().signOut().then(() => {
      devLog('Unauthentication completed')
    }).catch((error) => {
      console.error('Unauthentication failed:', error)
    })
  },
  loadRooms ({ commit }) {
    Firebase.database().ref('rooms').once('value', (newValue) => {
      commit('setRooms', newValue.val())
    })
  },
  loadCategories ({ commit }) {
    Firebase.database().ref('readingCategories').orderByChild('order').once('value', (newValue) => {
      commit('setCategories', newValue.val())
    })
  },
  loadErrors ({ commit }) {
    Firebase.database().ref('errors').on('value', (newValue) => {
      commit('setErrors', ObjectToArray(newValue.val()))
    })
  },
  async removeError (context, item) {
    await Firebase.database().ref('errors').child(item.id).remove()
  }
}

export const getters = {
  user (state) {
    return state.user
  },
  rooms (state) {
    return state.rooms
  },
  categories (state) {
    return state.categories
  },
  errors (state) {
    return state.errors
  },
  categoriesSorted (state) {
    const basicArray = ObjectToArray(state.categories)
    return basicArray.sort((a, b) => a.order - b.order)
  }
}
