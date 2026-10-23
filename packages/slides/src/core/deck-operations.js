/**
 * Handles element reordering, alignment, deletion, and property updates for slide decks.
 */
import { reorderElement, alignElements } from './arrange-utils.js'

export function updateDeckElement(deck, updated) {
  return {
    ...deck,
    slides: deck.slides.map((s) => {
      if (s.id !== deck.activeSlideId) return s
      return {
        ...s,
        elements: s.elements.map((el) => (el.id === updated.id ? updated : el)),
      }
    }),
  }
}

export function deleteDeckElements(deck, ids) {
  return {
    ...deck,
    slides: deck.slides.map((s) => {
      if (s.id !== deck.activeSlideId) return s
      return {
        ...s,
        elements: s.elements.filter((el) => !ids.includes(el.id)),
      }
    }),
  }
}

export function arrangeDeckElement(deck, elementId, action) {
  return {
    ...deck,
    slides: deck.slides.map((s) => {
      if (s.id !== deck.activeSlideId) return s
      return {
        ...s,
        elements: reorderElement(s.elements, elementId, action),
      }
    }),
  }
}

export function alignDeckElements(deck, elementIds, alignment) {
  return {
    ...deck,
    slides: deck.slides.map((s) => {
      if (s.id !== deck.activeSlideId) return s
      return {
        ...s,
        elements: alignElements(s.elements, elementIds, alignment),
      }
    }),
  }
}
