import { describe, it, expect } from 'vitest'
import {
  createPresentationDeck,
  createSlideElement,
  createTextElement,
} from '../core/slide-model.js'
import { computeSnapGuides, computeResize } from '../core/geometry-utils.js'
import { SLIDE_RATIOS, ELEMENT_TYPES, SHAPE_TYPES } from '../core/slide-constants.js'

describe('ZSlides Core - Slide Model & Geometry Utils', () => {
  describe('Slide Model Factories', () => {
    it('creates default widescreen presentation deck', () => {
      const deck = createPresentationDeck(SLIDE_RATIOS.WIDESCREEN)
      expect(deck.aspectRatio).toBe('16:9')
      expect(deck.dimensions).toEqual({ width: 960, height: 540 })
      expect(deck.slides.length).toBe(1)
      expect(deck.activeSlideId).toBe(deck.slides[0].id)
      expect(deck.slides[0].elements.length).toBe(2)
    })

    it('creates 4:3 standard presentation deck', () => {
      const deck = createPresentationDeck(SLIDE_RATIOS.STANDARD)
      expect(deck.aspectRatio).toBe('4:3')
      expect(deck.dimensions).toEqual({ width: 960, height: 720 })
    })

    it('creates rich text elements with defaults', () => {
      const textElem = createTextElement({ text: 'Hello ZSlides', fontSize: 32 })
      expect(textElem.type).toBe(ELEMENT_TYPES.TEXT)
      expect(textElem.properties.text).toBe('Hello ZSlides')
      expect(textElem.properties.fontSize).toBe(32)
      expect(textElem.width).toBe(400)
    })

    it('creates shape elements', () => {
      const shape = createSlideElement({
        type: ELEMENT_TYPES.SHAPE,
        properties: { shapeType: SHAPE_TYPES.ROUNDED_RECTANGLE, fill: '#ff0000' },
      })
      expect(shape.type).toBe(ELEMENT_TYPES.SHAPE)
      expect(shape.properties.shapeType).toBe('rounded_rect')
      expect(shape.properties.fill).toBe('#ff0000')
    })
  })

  describe('Geometry and Snapping Utils', () => {
    const slideBounds = { width: 960, height: 540 }

    it('snaps moving element to slide horizontal and vertical center', () => {
      const moving = { x: 378, y: 208, width: 200, height: 120 }
      // Center of 960 is 480. If width is 200, left edge at center is 480 - 100 = 380. (378 is within 6px)
      // Center of 540 is 270. If height is 120, top edge at center is 270 - 60 = 210. (208 is within 6px)
      const res = computeSnapGuides(moving, [], slideBounds)
      expect(res.x).toBe(380)
      expect(res.y).toBe(210)
      expect(res.guides.length).toBe(2)
    })

    it('computes SE handle resize accurately', () => {
      const original = { x: 100, y: 100, width: 200, height: 100 }
      const resized = computeResize(original, 'se', 50, 30)
      expect(resized).toEqual({ x: 100, y: 100, width: 250, height: 130 })
    })

    it('computes NW handle resize updating position and dimensions', () => {
      const original = { x: 100, y: 100, width: 200, height: 100 }
      const resized = computeResize(original, 'nw', 20, 15)
      expect(resized).toEqual({ x: 120, y: 115, width: 180, height: 85 })
    })
  })
})
