import { vi } from 'vitest'

const { mockFirebaseResult, mockFirebaseAuthResult } = vi.hoisted(() => ({
  mockFirebaseResult: vi.fn(() => false),
  mockFirebaseAuthResult: vi.fn(() => false)
}))

export { mockFirebaseResult, mockFirebaseAuthResult }

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
    ref: vi.fn(),
    limitToLast: vi.fn(),
    get: mockFirebaseResult,
    getDatabase () {
      return {}
    }
  }
})
