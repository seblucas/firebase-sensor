import { bootstrapIconClass } from '@/helper/bootstrapIcon'

describe('bootstrapIconClass', () => {
  it.each([
    ['fire', 'bi bi-fire'],
    ['glyphicon-fire', 'bi bi-fire'],
    ['tent', 'bi bi-house'],
    ['glyphicon-tent', 'bi bi-house'],
    ['scale', 'bi bi-speedometer2'],
    ['glyphicon glyphicon-scale', 'bi bi-speedometer2'],
    ['bed', 'bi bi-lamp'],
    ['glyphicon-bed', 'bi bi-lamp'],
    ['cutlery', 'bi bi-fork-knife'],
    ['glyphicon-cutlery', 'bi bi-fork-knife'],
    ['ice-lolly', 'bi bi-cake2'],
    ['glyphicon-ice-lolly', 'bi bi-cake2'],
    ['globe', 'bi bi-globe-americas'],
    ['glyphicon glyphicon-globe', 'bi bi-globe-americas'],
    ['tree-decidious', 'bi bi-tree-fill'],
    ['glyphicon-tree-deciduous', 'bi bi-tree-fill'],
    ['glyphicon-tree-conifer', 'bi bi-tree-fill'],
    ['bi bi-alarm', 'bi bi-alarm']
  ])('converts %s to %s', (source, expected) => {
    expect(bootstrapIconClass(source)).toBe(expected)
  })

  it.each([undefined, '', 'not a valid icon!', 'glyphicon-not-a-bootstrap-icon'])('uses a fallback for invalid icon %s', (source) => {
    expect(bootstrapIconClass(source)).toBe('bi bi-question-circle')
  })
})
