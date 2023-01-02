export const mockFirebaseResult = jest.fn(() => {
  return false
})

export const mockFirebaseAuthResult = jest.fn(() => {
  return false
})

jest.mock('firebase/auth', () => {
  return {
    onAuthStateChanged (auth, callback) {
      callback(mockFirebaseAuthResult())
    }
  }
})

jest.mock('firebase/database', () => {
  return {
    onChildAdded (ref, callback) {
      callback(mockFirebaseResult())
    },
    query: jest.fn(),
    ref: jest.fn(),
    limitToLast: jest.fn(),
    get: mockFirebaseResult
  }
})
