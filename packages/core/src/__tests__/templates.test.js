import { describe, it, expect } from 'vitest'
import {
  TEMPLATES,
  CATEGORIES,
  getTemplates,
  getTemplateById,
  getFeaturedTemplates,
  getCategoriesWithCounts,
} from '../templates/index.js'

describe('Templates Gallery Registry', () => {
  it('contains at least 20 original templates', () => {
    expect(TEMPLATES.length).toBeGreaterThanOrEqual(20)
    expect(TEMPLATES.length).toBe(23)
  })

  it('validates schema requirements for all templates', () => {
    const validApps = ['writer', 'sheets', 'slides', 'notes', 'forms', 'planner', 'draw']
    const validCategories = ['documents', 'finance', 'presentations', 'productivity', 'diagrams']

    for (const tmpl of TEMPLATES) {
      expect(tmpl.id).toBeDefined()
      expect(typeof tmpl.id).toBe('string')
      expect(tmpl.title).toBeDefined()
      expect(typeof tmpl.title).toBe('string')
      expect(tmpl.description).toBeDefined()
      expect(typeof tmpl.description).toBe('string')
      expect(validApps).toContain(tmpl.appId)
      expect(validCategories).toContain(tmpl.category)
      expect(tmpl.icon).toBeDefined()
      expect(typeof tmpl.content).toBe('string')
      expect(tmpl.content.length).toBeGreaterThan(0)

      if (tmpl.appId === 'writer') {
        expect(tmpl.content.trim().startsWith('<')).toBe(true)
      } else {
        expect(() => JSON.parse(tmpl.content)).not.toThrow()
      }
    }
  })

  it('filters templates by appId correctly', () => {
    const writerTemplates = getTemplates({ appId: 'writer' })
    expect(writerTemplates.length).toBe(6)
    writerTemplates.forEach((t) => expect(t.appId).toBe('writer'))

    const sheetsTemplates = getTemplates({ appId: 'sheets' })
    expect(sheetsTemplates.length).toBe(5)
    sheetsTemplates.forEach((t) => expect(t.appId).toBe('sheets'))

    const slidesTemplates = getTemplates({ appId: 'slides' })
    expect(slidesTemplates.length).toBe(4)
    slidesTemplates.forEach((t) => expect(t.appId).toBe('slides'))
  })

  it('filters templates by category correctly', () => {
    const financeTemplates = getTemplates({ category: 'finance' })
    expect(financeTemplates.length).toBeGreaterThanOrEqual(4)
    financeTemplates.forEach((t) => expect(t.category).toBe('finance'))

    const allTemplates = getTemplates({ category: 'all' })
    expect(allTemplates.length).toBe(TEMPLATES.length)
  })

  it('filters templates by search term', () => {
    const searchResume = getTemplates({ search: 'Resume' })
    expect(searchResume.length).toBeGreaterThanOrEqual(1)
    expect(searchResume[0].id).toBe('resume-modern')

    const searchBudget = getTemplates({ search: 'budget' })
    expect(searchBudget.length).toBeGreaterThanOrEqual(1)
  })

  it('finds template by id with getTemplateById', () => {
    const tmpl = getTemplateById('pitch-deck-startup')
    expect(tmpl).toBeDefined()
    expect(tmpl.title).toContain('Pitch Deck')

    const nonExistent = getTemplateById('nonexistent-template-id')
    expect(nonExistent).toBeUndefined()
  })

  it('provides featured templates for start screen', () => {
    const featured = getFeaturedTemplates()
    expect(featured.length).toBe(4)
    expect(featured.map((f) => f.id)).toContain('resume-modern')
    expect(featured.map((f) => f.id)).toContain('budget-family-annual')
  })

  it('calculates categories with accurate item counts', () => {
    const categories = getCategoriesWithCounts()
    expect(categories.length).toBe(CATEGORIES.length)
    const allCat = categories.find((c) => c.id === 'all')
    expect(allCat.count).toBe(TEMPLATES.length)
  })
})
