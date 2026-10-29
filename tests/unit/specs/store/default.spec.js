import { vi } from 'vitest'
import { isReactive } from 'vue'
import { createStore } from 'vuex'
import { mockFirebaseAuthResult } from '../../mocks/firebase.mock'
import { actions, getters, mutations as firebaseMutations } from '@/store/default'

describe('default store', () => {
  let store
  let mutations
  beforeEach(() => {
    mutations = {
      setUser: vi.fn(),
      setRooms: vi.fn(),
      setCategories: vi.fn(),
      setErrors: vi.fn(),
      setFirebaseApp: vi.fn()
    }
    actions.loadRooms = vi.fn()
    actions.loadCategories = vi.fn()
    actions.loadErrors = vi.fn()

    store = createStore({
      getters,
      mutations,
      actions
    })
  })

  it('remove all data when not connected', () => {
    store.dispatch('listenForAuthentication')

    expect(mutations.setUser).toHaveBeenCalled()
    expect(mutations.setRooms).toHaveBeenCalled()
    expect(mutations.setCategories).toHaveBeenCalled()
    expect(mutations.setErrors).toHaveBeenCalled()
  })
  it('load all data when connected', () => {
    mockFirebaseAuthResult.mockReset()
    mockFirebaseAuthResult.mockReturnValue({
      uid: 'user'
    })
    store.dispatch('listenForAuthentication')

    expect(mutations.setUser).toHaveBeenCalled()
    expect(actions.loadRooms).toHaveBeenCalled()
    expect(actions.loadCategories).toHaveBeenCalled()
    expect(actions.loadErrors).toHaveBeenCalled()
  })
  it('keeps Firebase SDK instances outside Vue reactivity', () => {
    const firebaseApp = {}
    store = createStore({
      state: {
        firebaseApp: false,
        firebaseAuth: false,
        firebaseDatabase: false
      },
      mutations: firebaseMutations
    })

    store.commit('setFirebaseApp', firebaseApp)

    expect(isReactive(store.state.firebaseApp)).toBe(false)
    expect(isReactive(store.state.firebaseAuth)).toBe(false)
    expect(isReactive(store.state.firebaseDatabase)).toBe(false)
  })
})
