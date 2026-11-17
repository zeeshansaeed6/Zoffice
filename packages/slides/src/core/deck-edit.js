/**
 * Pure deck edits used by the ZSlides ribbon and notes panel.
 */

const mapActiveSlide = (deck, fn) => ({
  ...deck,
  slides: deck.slides.map((s) => (s.id === deck.activeSlideId ? fn(s) : s)),
})

/**
 * Merges a property patch (fontSize, fontFamily, color...) into the given elements
 * of the active slide.
 */
export function setElementsProperties(deck, ids, patch) {
  return mapActiveSlide(deck, (slide) => ({
    ...slide,
    elements: slide.elements.map((el) =>
      ids.includes(el.id) ? { ...el, properties: { ...el.properties, ...patch } } : el,
    ),
  }))
}

/**
 * Duplicates elements on the active slide, offset so the copies are visible.
 * @returns {{ deck: Object, newIds: string[] }}
 */
export function duplicateElements(deck, ids, offset = 24) {
  const newIds = []
  const next = mapActiveSlide(deck, (slide) => {
    const copies = slide.elements
      .filter((el) => ids.includes(el.id))
      .map((el, i) => {
        const id = `${el.id}_copy_${Date.now().toString(36)}${i}`
        newIds.push(id)
        return { ...el, id, x: el.x + offset, y: el.y + offset }
      })
    return { ...slide, elements: [...slide.elements, ...copies] }
  })
  return { deck: next, newIds }
}

/** Sets a solid background colour on the active slide. */
export function setSlideBackground(deck, color) {
  return mapActiveSlide(deck, (slide) => ({ ...slide, background: { type: 'solid', color } }))
}

/** Replaces the speaker notes of a slide. */
export function setSlideNotes(deck, slideId, notes) {
  return {
    ...deck,
    slides: deck.slides.map((s) => (s.id === slideId ? { ...s, notes } : s)),
  }
}
