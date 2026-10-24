import { describe, it, expect } from 'vitest'
import {
  createBase,
  createTable,
  createField,
  createRecord,
  createView,
  generateId,
} from '../core/base-model.js'
import { FIELD_TYPES, VIEW_TYPES } from '../core/constants.js'

describe('ZBase Data Models', () => {
  it('generates unique IDs with optional prefix', () => {
    const id1 = generateId('tbl')
    const id2 = generateId('tbl')
    expect(id1.startsWith('tbl-')).toBe(true)
    expect(id1).not.toBe(id2)
  })

  it('creates a field with default text type', () => {
    const field = createField('Title')
    expect(field.name).toBe('Title')
    expect(field.type).toBe(FIELD_TYPES.TEXT)
    expect(field.id).toBeDefined()
  })

  it('creates a select field with options', () => {
    const field = createField('Status', FIELD_TYPES.SELECT, {
      options: [
        { id: '1', label: 'Open', color: '#ff0000' },
        { id: '2', label: 'Closed', color: '#00ff00' },
      ],
    })
    expect(field.type).toBe(FIELD_TYPES.SELECT)
    expect(field.options.length).toBe(2)
  })

  it('creates records with timestamps and custom fields', () => {
    const rec = createRecord({ fld1: 'Hello', fld2: 42 })
    expect(rec.id).toBeDefined()
    expect(rec.fields.fld1).toBe('Hello')
    expect(rec.fields.fld2).toBe(42)
    expect(rec.createdAt).toBeGreaterThan(0)
  })

  it('creates views with correct defaults', () => {
    const view = createView('My Grid', VIEW_TYPES.GRID)
    expect(view.name).toBe('My Grid')
    expect(view.type).toBe(VIEW_TYPES.GRID)
    expect(view.filters).toEqual([])
    expect(view.sorts).toEqual([])
  })

  it('creates a table with default views', () => {
    const table = createTable('Inventory')
    expect(table.name).toBe('Inventory')
    expect(table.views.length).toBe(1)
    expect(table.views[0].type).toBe(VIEW_TYPES.GRID)
  })

  it('creates a starter base with Projects and Team tables', () => {
    const base = createBase({ title: 'Workspace Base' })
    expect(base.title).toBe('Workspace Base')
    expect(base.tables.length).toBe(2)
    expect(base.tables[0].name).toBe('Projects')
    expect(base.tables[1].name).toBe('Team')
    expect(base.tables[0].records.length).toBeGreaterThanOrEqual(3)
  })
})
