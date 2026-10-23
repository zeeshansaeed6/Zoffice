import { describe, it, expect } from 'vitest'
import { getShapePath } from '../elements/shape-paths.js'
import { reorderElement, alignElements, distributeElements } from '../core/arrange-utils.js'
import { SHAPE_TYPES } from '../core/slide-constants.js'

describe('ZSlides Step 2 - Shapes, Text, and Arrange Utilities', () => {
  describe('Shape Path Generation', () => {
    it('generates triangle path with correct coordinates', () => {
      const path = getShapePath(SHAPE_TYPES.TRIANGLE, 100, 80)
      expect(path).toBe('M 50 0 L 100 80 L 0 80 Z')
    })

    it('generates 5-point star path', () => {
      const path = getShapePath(SHAPE_TYPES.STAR_5, 100, 100)
      expect(path.startsWith('M ')).toBe(true)
      expect(path.endsWith(' Z')).toBe(true)
      expect(path.split(' L ').length).toBe(10)
    })

    it('generates speech bubble with tail', () => {
      const path = getShapePath(SHAPE_TYPES.SPEECH_BUBBLE, 200, 100)
      expect(path).toContain('Q ')
      expect(path).toContain('Z')
    })

    it('generates arrows and lines', () => {
      const arrowPath = getShapePath(SHAPE_TYPES.RIGHT_ARROW, 150, 60)
      expect(arrowPath.startsWith('M 0')).toBe(true)

      const linePath = getShapePath(SHAPE_TYPES.LINE, 100, 20)
      expect(linePath).toBe('M 0 10 L 100 10')
    })
  })

  describe('Arrange Utilities (Reorder, Align, Distribute)', () => {
    const el1 = { id: 'el1', x: 10, y: 10, width: 50, height: 50 }
    const el2 = { id: 'el2', x: 100, y: 100, width: 50, height: 50 }
    const el3 = { id: 'el3', x: 200, y: 200, width: 50, height: 50 }
    const elements = [el1, el2, el3]

    it('brings element to front', () => {
      const reordered = reorderElement(elements, 'el1', 'front')
      expect(reordered[2].id).toBe('el1')
    })

    it('sends element to back', () => {
      const reordered = reorderElement(elements, 'el3', 'back')
      expect(reordered[0].id).toBe('el3')
    })

    it('aligns elements to left edge', () => {
      const aligned = alignElements(elements, ['el1', 'el2', 'el3'], 'left')
      expect(aligned[0].x).toBe(10)
      expect(aligned[1].x).toBe(10)
      expect(aligned[2].x).toBe(10)
    })

    it('aligns elements to center', () => {
      // minX=10, maxX=250 -> centerX = 130
      // For width 50, x = 130 - 25 = 105
      const aligned = alignElements(elements, ['el1', 'el2', 'el3'], 'center')
      expect(aligned[0].x).toBe(105)
      expect(aligned[1].x).toBe(105)
      expect(aligned[2].x).toBe(105)
    })

    it('distributes elements horizontally evenly', () => {
      // el1 at x=10 (w=50), el2 at x=80 (w=50), el3 at x=200 (w=50)
      const input = [
        { id: 'a', x: 0, width: 50 },
        { id: 'b', x: 40, width: 50 },
        { id: 'c', x: 200, width: 50 },
      ]
      // firstX=0, lastX=250. totalElemWidth=150. totalGap=100. gap=50.
      // Expected a=0, b=0+50+50=100, c=200
      const distributed = distributeElements(input, ['a', 'b', 'c'], 'horizontal')
      expect(distributed[0].x).toBe(0)
      expect(distributed[1].x).toBe(100)
      expect(distributed[2].x).toBe(200)
    })
  })
})
