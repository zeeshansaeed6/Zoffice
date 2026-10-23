import { describe, it, expect } from 'vitest'
import {
  createDefaultTable,
  createDefaultChart,
  createDefaultPicture,
} from '../core/element-factories.js'
import { ELEMENT_TYPES } from '../core/slide-constants.js'

describe('ZSlides Step 6 - Media, Tables, and Charts', () => {
  it('creates default table element with header and rows', () => {
    const table = createDefaultTable()
    expect(table.type).toBe(ELEMENT_TYPES.TABLE)
    expect(table.properties.rows).toBe(4)
    expect(table.properties.cols).toBe(3)
    expect(table.properties.data[0][0]).toBe('Product')
  })

  it('creates default chart element with datasets', () => {
    const chart = createDefaultChart()
    expect(chart.type).toBe(ELEMENT_TYPES.CHART)
    expect(chart.properties.chartType).toBe('bar')
    expect(chart.properties.labels).toEqual(['Q1', 'Q2', 'Q3', 'Q4'])
    expect(chart.properties.datasets[0].data.length).toBe(4)
  })

  it('creates default picture element with placeholder svg src', () => {
    const pic = createDefaultPicture()
    expect(pic.type).toBe(ELEMENT_TYPES.IMAGE)
    expect(pic.properties.src.startsWith('data:image/svg+xml')).toBe(true)
    expect(pic.properties.borderRadius).toBe(8)
  })
})
