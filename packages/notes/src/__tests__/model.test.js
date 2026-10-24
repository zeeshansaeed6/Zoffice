import { describe, it, expect } from 'vitest'
import { createNotebook, createSection, createPage, createBlock } from '../core/notebook-model.js'
import { BLOCK_TYPES, TAG_TYPES } from '../core/constants.js'

describe('ZNotes Model Factories', () => {
  it('creates a notebook with default properties', () => {
    const nb = createNotebook({ name: 'Work Notes' })
    expect(nb.id).toMatch(/^nb-/)
    expect(nb.name).toBe('Work Notes')
    expect(nb.sections).toEqual([])
    expect(nb.createdAt).toBeGreaterThan(0)
    expect(nb.updatedAt).toBeGreaterThan(0)
    expect(nb.color).toBeDefined()
  })

  it('creates a section attached to a notebook', () => {
    const sec = createSection('nb-123', { name: 'Projects' })
    expect(sec.id).toMatch(/^sec-/)
    expect(sec.notebookId).toBe('nb-123')
    expect(sec.name).toBe('Projects')
    expect(sec.pages).toEqual([])
  })

  it('creates a page attached to a section with tags', () => {
    const pg = createPage('sec-456', {
      title: 'Sprint Planning',
      tags: [TAG_TYPES.TODO, TAG_TYPES.IMPORTANT],
    })
    expect(pg.id).toMatch(/^page-/)
    expect(pg.sectionId).toBe('sec-456')
    expect(pg.title).toBe('Sprint Planning')
    expect(pg.tags).toContain(TAG_TYPES.TODO)
    expect(pg.tags).toContain(TAG_TYPES.IMPORTANT)
    expect(pg.blocks).toEqual([])
  })

  it('creates blocks of various types with default positions', () => {
    const textBlock = createBlock('page-1', BLOCK_TYPES.TEXT, { content: 'Hello' })
    expect(textBlock.id).toMatch(/^block-/)
    expect(textBlock.type).toBe('text')
    expect(textBlock.content).toBe('Hello')
    expect(textBlock.x).toBe(40)
    expect(textBlock.y).toBe(40)

    const checklistBlock = createBlock('page-1', BLOCK_TYPES.CHECKLIST)
    expect(checklistBlock.type).toBe('checklist')
    const parsed = JSON.parse(checklistBlock.content)
    expect(Array.isArray(parsed.items)).toBe(true)

    const tableBlock = createBlock('page-1', BLOCK_TYPES.TABLE)
    expect(tableBlock.type).toBe('table')

    const inkBlock = createBlock('page-1', BLOCK_TYPES.INK)
    expect(inkBlock.type).toBe('ink')

    const audioBlock = createBlock('page-1', BLOCK_TYPES.AUDIO)
    expect(audioBlock.type).toBe('audio')
  })
})
