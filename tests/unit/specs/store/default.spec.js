import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import { mockFirebaseAuthResult } from '../../mocks/firebase.mock'
import { actions, getters } from '@/store/default'

describe('default store', () => {
  let store
  let mutations
  let localVue

  beforeEach(() => {
    localVue = createLocalVue()

    localVue.use(Vuex)

    mutations = {
      setUser: jest.fn(),
      setRooms: jest.fn(),
      setCategories: jest.fn(),
      setErrors: jest.fn(),
      setFirebaseApp: jest.fn()
    }
    actions.loadRooms = jest.fn()
    actions.loadCategories = jest.fn()
    actions.loadErrors = jest.fn()

    store = new Vuex.Store({
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
})
