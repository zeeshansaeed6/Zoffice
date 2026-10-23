import { describe, it, expect } from 'vitest'
import {
  duplicateDeckSlide,
  deleteDeckSlide,
  reorderDeckSlides,
  setSlideTransition,
  applyTransitionToAllSlides,
} from '../core/slide-operations.js'
import { createPresentationDeck, createSlide } from '../core/slide-model.js'

describe('ZSlides Step 9 - Slide Show Operations', () => {
  it('duplicates a slide in deck', () => {
    const deck = createPresentationDeck()
    const updated = duplicateDeckSlide(deck, deck.slides[0].id)
    expect(updated.slides.length).toBe(2)
    expect(updated.slides[1].elements.length).toBe(deck.slides[0].elements.length)
  })

  it('deletes slide but preserves at least 1 slide', () => {
    const deck = createPresentationDeck()
    const updated = deleteDeckSlide(deck, deck.slides[0].id)
    expect(updated.slides.length).toBe(1) // Cannot delete last slide
  })

  it('reorders slides in deck', () => {
    const deck = createPresentationDeck()
    const slide2 = createSlide({ id: 'slide_2' })
    deck.slides.push(slide2)

    const reordered = reorderDeckSlides(deck, 0, 1)
    expect(reordered.slides[0].id).toBe('slide_2')
  })

  it('sets slide transition on target slide', () => {
    const deck = createPresentationDeck()
    const updated = setSlideTransition(deck, deck.slides[0].id, 'cube')
    expect(updated.slides[0].transition.type).toBe('cube')
  })

  it('applies transition to all slides in deck', () => {
    const deck = createPresentationDeck()
    deck.slides.push(createSlide({ id: 'slide_2' }))

    const updated = applyTransitionToAllSlides(deck, { type: 'zoom', duration: 0.8 })
    expect(updated.slides[0].transition.type).toBe('zoom')
    expect(updated.slides[1].transition.type).toBe('zoom')
  })
})
