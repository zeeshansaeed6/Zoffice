import { getThemeById } from './theme-definitions.js'

/**
 * Applies a theme to a presentation deck, updating default colors, fonts, and slide backgrounds.
 *
 * @param {Object} deck
 * @param {string} themeId
 * @returns {Object} Updated deck
 */
export function applyThemeToDeck(deck, themeId) {
  const theme = getThemeById(themeId)

  const updatedSlides = deck.slides.map((s) => {
    // Update slide background if it was solid
    const bg =
      s.background?.type === 'solid' ? { ...s.background, color: theme.background } : s.background

    // Update text elements and default shapes to match theme palette
    const updatedElements = s.elements.map((el) => {
      if (el.type === 'text') {
        const isHeader = (el.properties.fontSize || 0) >= 30
        return {
          ...el,
          properties: {
            ...el.properties,
            fontFamily: isHeader ? theme.fontHeading : theme.fontBody,
            color: isHeader
              ? theme.textPrimary
              : el.properties.color === '#64748b'
                ? theme.textSecondary
                : theme.textPrimary,
          },
        }
      }
      if (el.type === 'shape') {
        return {
          ...el,
          properties: {
            ...el.properties,
            fill: theme.primary,
            stroke: theme.secondary,
          },
        }
      }
      return el
    })

    return {
      ...s,
      background: bg,
      elements: updatedElements,
    }
  })

  return {
    ...deck,
    themeId,
    slides: updatedSlides,
  }
}
