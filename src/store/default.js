import Firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import ObjectToArray from '@/helper/object2array'

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
        console.log('Logged in as:', authData.uid)
        commit('setUser', authData)
        dispatch('loadRooms')
        dispatch('loadCategories')
        dispatch('loadErrors')
      } else {
        console.log('Logged out')
        commit('setUser', null)
        commit('setRooms', null)
        commit('setCategories', null)
        commit('setErrors', [])
      }
    })
  },
  login () {
    var provider = new Firebase.auth.GoogleAuthProvider()
    Firebase.auth().signInWithPopup(provider).then(() => {
      // No need to do anything here it's handled by $onAuthStateChanged
    }).catch((error) => {
      console.error('Authentication failed:', error)
    })
  },
  logout () {
    Firebase.auth().signOut().then(() => {
      console.log('Unauthentication completed')
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
    Firebase.database().ref('errors').once('value', (newValue) => {
      commit('setErrors', ObjectToArray(newValue.val()))
    })
  },
  removeError ({ commit, getters }, item) {
    const filteredArray = getters.errors.filter(error => error.id !== item.id)
    commit('setErrors', filteredArray)
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
    var basicArray = ObjectToArray(state.categories)
    return basicArray.sort((a, b) => a.order - b.order)
  }
}
