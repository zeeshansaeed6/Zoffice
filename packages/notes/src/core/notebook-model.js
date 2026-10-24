/**
 * ZNotes data model — factory functions for notebooks, sections, pages, and blocks.
 * @module notebook-model
 */

import { BLOCK_TYPES, DEFAULT_BLOCK, NOTEBOOK_COLORS, SECTION_COLORS } from './constants.js'

/**
 * @typedef {Object} Block
 * @property {string} id
 * @property {string} pageId
 * @property {string} type - One of BLOCK_TYPES
 * @property {string} content - JSON-serialized block content
 * @property {number} x - X position on canvas
 * @property {number} y - Y position on canvas
 * @property {number} width
 * @property {number} height
 * @property {number} order
 * @property {number} createdAt
 * @property {number} updatedAt
 */

/**
 * @typedef {Object} Page
 * @property {string} id
 * @property {string} sectionId
 * @property {string} title
 * @property {string[]} tags - Tag type strings
 * @property {Block[]} blocks
 * @property {number} order
 * @property {number} createdAt
 * @property {number} updatedAt
 */

/**
 * @typedef {Object} Section
 * @property {string} id
 * @property {string} notebookId
 * @property {string} name
 * @property {string} color
 * @property {Page[]} pages
 * @property {number} order
 * @property {number} createdAt
 * @property {number} updatedAt
 */

/**
 * @typedef {Object} Notebook
 * @property {string} id
 * @property {string} name
 * @property {string} color
 * @property {Section[]} sections
 * @property {number} createdAt
 * @property {number} updatedAt
 */

/**
 * Generate a unique ID with optional entity prefix.
 * @param {string} [prefix='']
 * @returns {string}
 */
export function generateId(prefix = '') {
  const p = prefix ? `${prefix}-` : ''
  return `${p}${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/**
 * Create a new notebook.
 * @param {Partial<Notebook>} [overrides]
 * @returns {Notebook}
 */
export function createNotebook(overrides = {}) {
  const now = Date.now()
  return {
    id: generateId('nb'),
    name: overrides.name || 'New Notebook',
    color: overrides.color || NOTEBOOK_COLORS[Math.floor(Math.random() * NOTEBOOK_COLORS.length)],
    sections: overrides.sections || [],
    createdAt: overrides.createdAt || now,
    updatedAt: overrides.updatedAt || now,
  }
}

/**
 * Create a new section.
 * @param {string} notebookId
 * @param {Partial<Section>} [overrides]
 * @returns {Section}
 */
export function createSection(notebookId, overrides = {}) {
  const now = Date.now()
  return {
    id: generateId('sec'),
    notebookId,
    name: overrides.name || 'New Section',
    color: overrides.color || SECTION_COLORS[Math.floor(Math.random() * SECTION_COLORS.length)],
    pages: overrides.pages || [],
    order: overrides.order ?? 0,
    createdAt: overrides.createdAt || now,
    updatedAt: overrides.updatedAt || now,
  }
}

/**
 * Create a new page.
 * @param {string} sectionId
 * @param {Partial<Page>} [overrides]
 * @returns {Page}
 */
export function createPage(sectionId, overrides = {}) {
  const now = Date.now()
  return {
    id: generateId('page'),
    sectionId,
    title: overrides.title || 'Untitled Page',
    tags: overrides.tags || [],
    blocks: overrides.blocks || [],
    order: overrides.order ?? 0,
    createdAt: overrides.createdAt || now,
    updatedAt: overrides.updatedAt || now,
  }
}

/**
 * Create a new block.
 * @param {string} pageId
 * @param {string} type - One of BLOCK_TYPES
 * @param {Partial<Block>} [overrides]
 * @returns {Block}
 */
export function createBlock(pageId, type = BLOCK_TYPES.TEXT, overrides = {}) {
  const now = Date.now()
  return {
    id: generateId('block'),
    pageId,
    type,
    content: overrides.content || getDefaultContent(type),
    x: overrides.x ?? 40,
    y: overrides.y ?? 40,
    width: overrides.width ?? DEFAULT_BLOCK.width,
    height: overrides.height ?? DEFAULT_BLOCK.height,
    order: overrides.order ?? 0,
    createdAt: overrides.createdAt || now,
    updatedAt: overrides.updatedAt || now,
  }
}

/**
 * Get default content for a block type.
 * @param {string} type
 * @returns {string}
 */
export function getDefaultContent(type) {
  switch (type) {
    case BLOCK_TYPES.TEXT:
      return ''
    case BLOCK_TYPES.IMAGE:
      return JSON.stringify({ src: '', alt: '' })
    case BLOCK_TYPES.TABLE:
      return JSON.stringify({
        rows: [
          ['', ''],
          ['', ''],
        ],
      })
    case BLOCK_TYPES.CHECKLIST:
      return JSON.stringify({ items: [{ text: '', checked: false }] })
    case BLOCK_TYPES.INK:
      return JSON.stringify({ paths: [] })
    case BLOCK_TYPES.AUDIO:
      return JSON.stringify({ dataUrl: '', duration: 0 })
    default:
      return ''
  }
}
