const iconAliases = {
  bed: 'lamp',
  cutlery: 'fork-knife',
  fire: 'fire',
  globe: 'globe-americas',
  'ice-lolly': 'cake2',
  'ice-lolly-tasted': 'snow3',
  scale: 'speedometer2',
  tent: 'house',
  'tree-conifer': 'tree-fill',
  'tree-deciduous': 'tree-fill',
  'tree-decidious': 'tree-fill'
}

export function bootstrapIconClass (icon) {
  if (typeof icon !== 'string') return 'bi bi-question-circle'

  const value = icon.trim().split(/\s+/).pop()
  const isLegacyGlyphIcon = /\bglyphicon(?:-|$)/.test(icon)
  const legacyName = value.replace(/^(glyphicon-|bi-)/, '')
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(legacyName)) return 'bi bi-question-circle'

  if (Object.hasOwn(iconAliases, legacyName)) return `bi bi-${iconAliases[legacyName]}`
  if (isLegacyGlyphIcon) return 'bi bi-question-circle'

  return `bi bi-${legacyName}`
}
