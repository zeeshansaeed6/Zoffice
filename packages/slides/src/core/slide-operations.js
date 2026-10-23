/**
 * Slide deck presentation navigation and slide show state helpers.
 */

export function duplicateDeckSlide(deck, slideId) {
  const idx = deck.slides.findIndex((s) => s.id === slideId)
  if (idx === -1) return deck
  const src = deck.slides[idx]
  const cloned = {
    ...src,
    id: `slide_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    elements: src.elements.map((el) => ({
      ...el,
      id: `elem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    })),
  }
  const newSlides = [...deck.slides]
  newSlides.splice(idx + 1, 0, cloned)
  return { ...deck, activeSlideId: cloned.id, slides: newSlides }
}

export function deleteDeckSlide(deck, slideId) {
  if (deck.slides.length <= 1) return deck
  const idx = deck.slides.findIndex((s) => s.id === slideId)
  const newSlides = deck.slides.filter((s) => s.id !== slideId)
  return { ...deck, activeSlideId: newSlides[Math.max(0, idx - 1)].id, slides: newSlides }
}

export function reorderDeckSlides(deck, fromIndex, toIndex) {
  const copy = [...deck.slides]
  const [moved] = copy.splice(fromIndex, 1)
  copy.splice(toIndex, 0, moved)
  return { ...deck, slides: copy }
}

export function setSlideTransition(deck, slideId, transitionType) {
  return {
    ...deck,
    slides: deck.slides.map((s) =>
      s.id === slideId ? { ...s, transition: { ...s.transition, type: transitionType } } : s,
    ),
  }
}

export function applyTransitionToAllSlides(deck, transition) {
  return {
    ...deck,
    slides: deck.slides.map((s) => ({ ...s, transition: { ...transition } })),
  }
}
