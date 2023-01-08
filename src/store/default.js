import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { getDatabase, ref, get, onValue, remove, query, limitToLast } from 'firebase/database'

import ObjectToArray from '@/helper/object2array'
import devLog from '@/helper/devLog'

export const state = {
  firebaseApp: false,
  firebaseAuth: false,
  firebaseDatabase: false,
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
  },
  setFirebaseApp (state, payload) {
    state.firebaseApp = payload
    state.firebaseAuth = getAuth()
    state.firebaseDatabase = getDatabase(state.firebaseApp)
  }
}

export const actions = {
  listenForAuthentication ({ dispatch, commit, getters }) {
    onAuthStateChanged(getters.firebaseAuth, (authData) => {
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
  login ({ getters }) {
    const provider = new GoogleAuthProvider()
    signInWithPopup(getters.firebaseAuth, provider).then(() => {
      // No need to do anything here it's handled by $onAuthStateChanged
    }).catch((error) => {
      console.error('Authentication failed:', error)
    })
  },
  logout ({ getters }) {
    signOut(getters.firebaseAuth).then(() => {
      devLog('Unauthentication completed')
    }).catch((error) => {
      console.error('Unauthentication failed:', error)
    })
  },
  loadRooms ({ commit, getters }) {
    get(ref(getters.firebaseDatabase, 'rooms')).then((newValue) => {
      commit('setRooms', newValue.val())
    }).catch((error) => {
      console.error(error)
    })
  },
  loadCategories ({ commit, getters }) {
    get(ref(getters.firebaseDatabase, 'readingCategories')).then((newValue) => {
      commit('setCategories', newValue.val())
    }).catch((error) => {
      console.error(error)
    })
  },
  loadErrors ({ commit, getters }) {
    const errors = ref(getters.firebaseDatabase, 'errors')
    onValue(errors, (newValue) => {
      commit('setErrors', ObjectToArray(newValue.val()))
    })
  },
  async loadDataFromFirebase ({ getters }, { roomId, startTimestamp, numberOfHours, categoryId }) {
    const queryReadings = query(ref(getters.firebaseDatabase, 'readings/' + roomId), limitToLast(4 * (numberOfHours + 1)))
    const newValue = await get(queryReadings)
    devLog(`Loaded from database for ${roomId}`)
    let basicArray = ObjectToArray(newValue.val())

    basicArray = basicArray.filter((item) => {
      // Remove too old readings and readings without the category
      return item.time > startTimestamp &&
        (!categoryId || Object.prototype.hasOwnProperty.call(item, categoryId))
    })
    return basicArray
  },
  async removeError ({ getters }, item) {
    await remove(ref(getters.firebaseDatabase, 'errors/' + item.id))
  }
}

export const getters = {
  firebaseAuth (state) {
    return state.firebaseAuth
  },
  firebaseApp (state) {
    return state.firebaseApp
  },
  firebaseDatabase (state) {
    return state.firebaseDatabase
  },
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
