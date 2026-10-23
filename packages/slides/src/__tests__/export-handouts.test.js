import { describe, it, expect } from 'vitest'
import { exportSlideAsSvgString, generateHandoutsHtml } from '../core/export-utils.js'
import { createSlide } from '../core/slide-model.js'
import { applySlideLayout, addSlideAnimation, toggleSlideHidden } from '../core/slide-operations.js'
import { LAYOUT_TYPES } from '../core/slide-layouts.js'

describe('export-utils', () => {
  const sampleSlide = createSlide({
    background: '#ffffff',
    notes: 'Speaker notes for slide 1',
    elements: [
      {
        id: 't1',
        type: 'text',
        x: 50,
        y: 60,
        width: 400,
        height: 60,
        text: 'Handout Slide Header',
        fontSize: 24,
        color: '#0f172a',
      },
      {
        id: 's1',
        type: 'shape',
        shapeType: 'rect',
        x: 50,
        y: 150,
        width: 200,
        height: 100,
        fill: '#3b82f6',
      },
      {
        id: 's2',
        type: 'shape',
        shapeType: 'ellipse',
        x: 300,
        y: 150,
        width: 100,
        height: 100,
        fill: '#ef4444',
      },
    ],
  })

  it('exportSlideAsSvgString produces valid SVG with shapes and text', () => {
    const svg = exportSlideAsSvgString(sampleSlide)
    expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg"')
    expect(svg).toContain('Handout Slide Header')
    expect(svg).toContain('<rect')
    expect(svg).toContain('<ellipse')
  })

  it('generateHandoutsHtml renders 3-up ruled handouts layout', () => {
    const slides = [sampleSlide, sampleSlide, sampleSlide, sampleSlide]
    const html = generateHandoutsHtml({
      slides,
      slidesPerPage: 3,
      includeSlideNumbers: true,
      title: 'Quarterly Review',
    })

    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('Quarterly Review')
    expect(html).toContain('three-up-slide')
    expect(html).toContain('ruled-line')
    expect(html).toContain('Page 1')
    expect(html).toContain('Page 2')
  })

  it('generateHandoutsHtml renders notes page layout with speaker notes', () => {
    const slides = [sampleSlide]
    const html = generateHandoutsHtml({
      slides,
      slidesPerPage: 'notes',
      includeSlideNumbers: true,
      title: 'Speaker Handout',
    })

    expect(html).toContain('Speaker notes for slide 1')
    expect(html).toContain('notes-page-item')
  })

  it('generateHandoutsHtml supports grid-4-up and grid-6-up', () => {
    const slides = [sampleSlide, sampleSlide, sampleSlide, sampleSlide]
    const html4 = generateHandoutsHtml({ slides, slidesPerPage: 4 })
    expect(html4).toContain('grid-4-up')

    const html6 = generateHandoutsHtml({ slides, slidesPerPage: 6 })
    expect(html6).toContain('grid-6-up')
  })
})

describe('slide-operations helpers', () => {
  it('applySlideLayout updates slide layout and generates layout elements', () => {
    const deck = {
      activeSlideId: 's1',
      dimensions: { width: 960, height: 540 },
      slides: [{ id: 's1', layout: LAYOUT_TYPES.BLANK, elements: [] }],
    }

    const updated = applySlideLayout(deck, 's1', LAYOUT_TYPES.TITLE_AND_CONTENT)
    expect(updated.slides[0].layout).toBe(LAYOUT_TYPES.TITLE_AND_CONTENT)
    expect(updated.slides[0].elements.length).toBeGreaterThan(0)
  })

  it('addSlideAnimation appends animation to slide', () => {
    const deck = {
      slides: [{ id: 's1', animations: [] }],
    }
    const anim = { id: 'a1', type: 'fade_in', elementId: 'el1' }
    const updated = addSlideAnimation(deck, 's1', anim)
    expect(updated.slides[0].animations).toHaveLength(1)
    expect(updated.slides[0].animations[0].id).toBe('a1')
  })

  it('toggleSlideHidden flips hidden flag on targeted slide', () => {
    const deck = {
      slides: [{ id: 's1', hidden: false }],
    }
    const toggled = toggleSlideHidden(deck, 's1')
    expect(toggled.slides[0].hidden).toBe(true)

    const unhidden = toggleSlideHidden(toggled, 's1')
    expect(unhidden.slides[0].hidden).toBe(false)
  })
})
