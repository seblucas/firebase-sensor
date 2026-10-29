export function formatDate (value) {
  if (value) {
    return new Date(value * 1000).toLocaleString()
  }
}

export function formatNumber (value, fractionSize) {
  if (value) {
    return value.toLocaleString(undefined, { minimumFractionDigits: fractionSize, maximumFractionDigits: fractionSize })
  }
}
