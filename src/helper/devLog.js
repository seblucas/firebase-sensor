export default (...params) => {
  if (import.meta.env.DEV) {
    console.log(...params)
  }
}
