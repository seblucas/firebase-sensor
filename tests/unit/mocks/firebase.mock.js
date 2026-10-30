import { vi } from 'vitest'

const { mockFirebaseResult, mockFirebaseAuthResult, mockFirebaseRef, mockFirebaseUpdate } = vi.hoisted(() => ({
  mockFirebaseResult: vi.fn(() => false),
  mockFirebaseAuthResult: vi.fn(() => false),
  mockFirebaseRef: vi.fn(),
  mockFirebaseUpdate: vi.fn()
}))

export { mockFirebaseResult, mockFirebaseAuthResult, mockFirebaseRef, mockFirebaseUpdate }

vi.mock('firebase/auth', () => {
  return {
    getAuth () {
      return {}
    },
    onAuthStateChanged (auth, callback) {
      callback(mockFirebaseAuthResult())
    }
  }
})

vi.mock('firebase/database', () => {
  return {
    onChildAdded (ref, callback) {
      callback(mockFirebaseResult())
    },
    query: vi.fn(),
    ref: mockFirebaseRef,
    limitToLast: vi.fn(),
    get: mockFirebaseResult,
    update: mockFirebaseUpdate,
    getDatabase () {
      return {}
    }
  }
})
