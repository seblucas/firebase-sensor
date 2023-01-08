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
    setFirebaseApp: jest.fn()
  },
  actions: {
    login: jest.fn(),
    logout: jest.fn(),
    listenForAuthentication: jest.fn(),
    loadDataFromFirebase: () => { return [] }
  }
}
