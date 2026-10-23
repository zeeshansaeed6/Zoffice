import { describe, it, expect } from 'vitest'
import { SLIDE_THEMES, getThemeById } from '../core/theme-definitions.js'
import { applyThemeToDeck } from '../core/theme-engine.js'
import { createPresentationDeck } from '../core/slide-model.js'

describe('ZSlides Step 4 - Slide Master and Theme Definitions', () => {
  it('defines 12 distinct original themes', () => {
    expect(SLIDE_THEMES.length).toBe(12)
    const ids = new Set(SLIDE_THEMES.map((t) => t.id))
    expect(ids.size).toBe(12)
  })

  it('provides all mandatory design tokens for every theme', () => {
    for (const theme of SLIDE_THEMES) {
      expect(theme.name).toBeDefined()
      expect(theme.background).toMatch(/^#/)
      expect(theme.textPrimary).toMatch(/^#/)
      expect(theme.textSecondary).toMatch(/^#/)
      expect(theme.primary).toMatch(/^#/)
      expect(theme.secondary).toMatch(/^#/)
      expect(theme.accent).toMatch(/^#/)
      expect(theme.fontHeading).toBeDefined()
      expect(theme.fontBody).toBeDefined()
    }
  })

  it('retrieves specific theme or default', () => {
    const theme = getThemeById('midnight_dark')
    expect(theme.name).toBe('Midnight Dark')
    expect(theme.background).toBe('#090d16')

    const fallback = getThemeById('non_existent')
    expect(fallback.id).toBe('modern_clean')
  })

  it('applies theme palette to all slides in a deck', () => {
    const deck = createPresentationDeck()
    const updated = applyThemeToDeck(deck, 'sunset_vivid')
    expect(updated.themeId).toBe('sunset_vivid')
    expect(updated.slides[0].background.color).toBe('#fffbeb')
    expect(updated.slides[0].elements[0].properties.color).toBe('#451a03')
  })
})
