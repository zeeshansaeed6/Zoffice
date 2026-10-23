import { describe, it, expect } from 'vitest'
import { writePptx } from '../pptx/pptx-writer.js'
import { readPptx } from '../pptx/pptx-parser.js'
import {
  createPresentationDeck,
  createTextElement,
  createSlideElement,
  createSlide,
} from '../core/slide-model.js'
import { SHAPE_TYPES } from '../core/slide-constants.js'

describe('ZSlides Step 5 - .pptx Read & Write Roundtrip', () => {
  it('writes and re-reads a presentation deck with text and shapes', async () => {
    const deck = createPresentationDeck()

    // Add a second slide with custom elements
    const slide2 = createSlide({
      id: 'slide_2',
      elements: [
        createTextElement({
          x: 100,
          y: 50,
          width: 600,
          height: 60,
          text: 'Second Slide Overview',
          fontSize: 32,
          bold: true,
        }),
        createSlideElement({
          x: 200,
          y: 180,
          width: 300,
          height: 150,
          properties: {
            shapeType: SHAPE_TYPES.ROUNDED_RECTANGLE,
            fill: '#059669',
          },
        }),
      ],
    })
    deck.slides.push(slide2)

    // Serialize to PPTX ArrayBuffer
    const buffer = await writePptx(deck, 'arraybuffer')
    expect(buffer).toBeDefined()
    expect(buffer.byteLength).toBeGreaterThan(1000)

    // Re-read PPTX back into model
    const parsed = await readPptx(buffer)
    expect(parsed.slides.length).toBe(2)

    // Verify slide 1 title text preserved
    const slide1Text = parsed.slides[0].elements.find((el) => el.type === 'text')
    expect(slide1Text).toBeDefined()
    expect(slide1Text.properties.text).toContain('Presentation Title')

    // Verify slide 2 title text preserved
    const slide2Text = parsed.slides[1].elements.find((el) => el.type === 'text')
    expect(slide2Text).toBeDefined()
    expect(slide2Text.properties.text).toContain('Second Slide Overview')

    // Verify slide 2 shape preserved
    const slide2Shape = parsed.slides[1].elements.find((el) => el.type === 'shape')
    expect(slide2Shape).toBeDefined()
    expect(slide2Shape.width).toBeGreaterThan(0)
    expect(slide2Shape.height).toBeGreaterThan(0)
  })
})
