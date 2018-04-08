export const firebaseResult = jest.fn(() => {
  return false
})

export const $firebase = {
  database () {
    const mock = {
      limitToLast () {
        return mock
      },
      ref () {
        return mock
      },
      on (action, callback) {
        const res = {
          val () {
            return firebaseResult()
          }
        }
        callback(res)
      },
      once (action, callback) {
        const res = {
          val () {
            return firebaseResult()
          }
        }
        callback(res)
      }
    }
    return mock
  }
}
