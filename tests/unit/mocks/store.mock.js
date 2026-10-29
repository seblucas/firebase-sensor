import { vi } from 'vitest'

export const mockStore = {
  getters: {
    rooms: () => false,
    errors: () => false,
    categories: () => false,
    authData: () => {
      return {
        uid: 'xxxxxAAAA',
        providerData: [
          { displayName: 'John Doe' }
        ]
      }
    }
  },
  mutations: {
    setFirebaseApp: vi.fn()
  },
  actions: {
    login: vi.fn(),
    logout: vi.fn(),
    listenForAuthentication: vi.fn(),
    loadDataFromFirebase: () => { return [] }
  }
}
