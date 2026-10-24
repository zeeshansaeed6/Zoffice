/**
 * Zoffice Templates Registry & Library
 * Provides access to all original offline templates across the entire office suite.
 * @module templates
 */

import { WRITER_TEMPLATES } from './writer-templates.js'
import { SHEETS_TEMPLATES } from './sheets-templates.js'
import { SLIDES_TEMPLATES } from './slides-templates.js'
import { COMPANION_TEMPLATES } from './companion-templates.js'

/**
 * @typedef {Object} TemplateDefinition
 * @property {string} id - Unique template ID
 * @property {string} title - Display title
 * @property {string} description - Brief summary
 * @property {string} appId - Target app ('writer' | 'sheets' | 'slides' | 'notes' | 'forms' | 'planner' | 'draw')
 * @property {'documents' | 'finance' | 'presentations' | 'productivity' | 'diagrams'} category
 * @property {string} icon - Lucide icon name
 * @property {string} content - Serialized initial content string
 */

/** @type {TemplateDefinition[]} */
export const TEMPLATES = [
  ...WRITER_TEMPLATES,
  ...SHEETS_TEMPLATES,
  ...SLIDES_TEMPLATES,
  ...COMPANION_TEMPLATES,
]

export const CATEGORIES = [
  { id: 'all', label: 'All Templates' },
  { id: 'documents', label: 'Documents & Letters' },
  { id: 'finance', label: 'Finance & Spreadsheets' },
  { id: 'presentations', label: 'Presentations & Decks' },
  { id: 'productivity', label: 'Productivity & Planning' },
  { id: 'diagrams', label: 'Diagrams & Architecture' },
]

/**
 * Retrieves templates filtered by optional appId, category, or search query.
 * @param {Object} [filter]
 * @param {string} [filter.appId]
 * @param {string} [filter.category]
 * @param {string} [filter.search]
 * @returns {TemplateDefinition[]}
 */
export function getTemplates({ appId, category, search } = {}) {
  return TEMPLATES.filter((tmpl) => {
    if (appId && tmpl.appId !== appId) return false
    if (category && category !== 'all' && tmpl.category !== category) return false
    if (search) {
      const q = search.toLowerCase().trim()
      const matchTitle = tmpl.title.toLowerCase().includes(q)
      const matchDesc = tmpl.description.toLowerCase().includes(q)
      if (!matchTitle && !matchDesc) return false
    }
    return true
  })
}

/**
 * Find template by its unique ID.
 * @param {string} id
 * @returns {TemplateDefinition | undefined}
 */
export function getTemplateById(id) {
  return TEMPLATES.find((t) => t.id === id)
}

/**
 * Return featured templates for quick launcher display.
 * @returns {TemplateDefinition[]}
 */
export function getFeaturedTemplates() {
  const featuredIds = [
    'resume-modern',
    'budget-family-annual',
    'pitch-deck-startup',
    'planner-sprint-board',
  ]
  return featuredIds.map((id) => getTemplateById(id)).filter(Boolean)
}

/**
 * Return available categories with counts.
 * @returns {Array<{ id: string, label: string, count: number }>}
 */
export function getCategoriesWithCounts() {
  return CATEGORIES.map((cat) => ({
    ...cat,
    count:
      cat.id === 'all'
        ? TEMPLATES.length
        : TEMPLATES.filter((t) => t.category === cat.id).length,
  }))
}
