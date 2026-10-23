import { describe, it, expect } from 'vitest'
import { createElementsForLayout, LAYOUT_TYPES } from '../core/slide-layouts.js'

describe('ZSlides Step 3 - Slide Layouts and Thumbnail Management', () => {
  const dimensions = { width: 960, height: 540 }

  it('creates Title slide layout elements', () => {
    const elems = createElementsForLayout(LAYOUT_TYPES.TITLE, dimensions)
    expect(elems.length).toBe(2)
    expect(elems[0].properties.fontSize).toBe(44)
    expect(elems[1].properties.fontSize).toBe(22)
  })

  it('creates Title and Content slide layout elements', () => {
    const elems = createElementsForLayout(LAYOUT_TYPES.TITLE_AND_CONTENT, dimensions)
    expect(elems.length).toBe(2)
    expect(elems[0].properties.text).toBe('Slide Title')
    expect(elems[1].properties.text).toContain('takeaway')
  })

  it('creates Two Content layout with side-by-side columns', () => {
    const elems = createElementsForLayout(LAYOUT_TYPES.TWO_CONTENT, dimensions)
    expect(elems.length).toBe(3)
    // Left column x < Right column x
    expect(elems[1].x).toBeLessThan(elems[2].x)
    expect(elems[1].width).toBe(elems[2].width)
  })

  it('creates Comparison layout with headers and content boxes', () => {
    const elems = createElementsForLayout(LAYOUT_TYPES.COMPARISON, dimensions)
    expect(elems.length).toBe(5) // Title, Header A, Content A, Header B, Content B
  })

  it('creates Blank layout with 0 elements', () => {
    const elems = createElementsForLayout(LAYOUT_TYPES.BLANK, dimensions)
    expect(elems.length).toBe(0)
  })
})
