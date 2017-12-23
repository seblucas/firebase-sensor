export default (obj) => {
  return Object.keys(obj).map((key) => {
    return Object.assign({ id: key }, obj[key])
  })
}
