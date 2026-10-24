/**
 * ZBase Data Models — factory functions for bases, tables, fields, views, and records.
 * @module base-model
 */

import { FIELD_TYPES, VIEW_TYPES } from './constants.js'

/**
 * Generate unique entity ID.
 * @param {string} [prefix='']
 * @returns {string}
 */
export function generateId(prefix = '') {
  const p = prefix ? `${prefix}-` : ''
  return `${p}${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/**
 * @typedef {Object} FieldOption
 * @property {string} id
 * @property {string} label
 * @property {string} color
 */

/**
 * @typedef {Object} TableField
 * @property {string} id
 * @property {string} name
 * @property {string} type - One of FIELD_TYPES
 * @property {FieldOption[]} [options] - For select/multiselect
 * @property {string} [formula] - For formula fields
 * @property {string} [linkedTableId] - For link fields
 * @property {string} [lookupFieldId] - For lookup/rollup fields
 * @property {string} [rollupOperation] - For rollup fields ('count', 'sum', 'average')
 * @property {number} width - Column width in pixels
 */

/**
 * Create a table field definition.
 * @param {string} name
 * @param {string} [type=FIELD_TYPES.TEXT]
 * @param {Partial<TableField>} [overrides={}]
 * @returns {TableField}
 */
export function createField(name = 'Field', type = FIELD_TYPES.TEXT, overrides = {}) {
  return {
    id: overrides.id || generateId('fld'),
    name: overrides.name || name,
    type: overrides.type || type,
    options: overrides.options || [],
    formula: overrides.formula || '',
    linkedTableId: overrides.linkedTableId || '',
    lookupFieldId: overrides.lookupFieldId || '',
    rollupOperation: overrides.rollupOperation || 'sum',
    width: overrides.width ?? 180,
  }
}

/**
 * @typedef {Object} TableRecord
 * @property {string} id
 * @property {Record<string, any>} fields - Field values mapped by field ID
 * @property {number} createdAt
 * @property {number} updatedAt
 */

/**
 * Create a new record in a table.
 * @param {Record<string, any>} [fields={}]
 * @param {Partial<TableRecord>} [overrides={}]
 * @returns {TableRecord}
 */
export function createRecord(fields = {}, overrides = {}) {
  const now = Date.now()
  return {
    id: overrides.id || generateId('rec'),
    fields: { ...fields, ...(overrides.fields || {}) },
    createdAt: overrides.createdAt || now,
    updatedAt: overrides.updatedAt || now,
  }
}

/**
 * @typedef {Object} TableView
 * @property {string} id
 * @property {string} name
 * @property {string} type - One of VIEW_TYPES
 * @property {Array<{ fieldId: string, operator: string, value: any }>} filters
 * @property {Array<{ fieldId: string, direction: 'asc'|'desc' }>} sorts
 * @property {string|null} groupByFieldId
 * @property {string[]} hiddenFieldIds
 */

/**
 * Create a table view.
 * @param {string} name
 * @param {string} [type=VIEW_TYPES.GRID]
 * @param {Partial<TableView>} [overrides={}]
 * @returns {TableView}
 */
export function createView(name = 'Grid view', type = VIEW_TYPES.GRID, overrides = {}) {
  return {
    id: overrides.id || generateId('viw'),
    name: overrides.name || name,
    type: overrides.type || type,
    filters: overrides.filters || [],
    sorts: overrides.sorts || [],
    groupByFieldId: overrides.groupByFieldId || null,
    hiddenFieldIds: overrides.hiddenFieldIds || [],
  }
}

/**
 * @typedef {Object} BaseTable
 * @property {string} id
 * @property {string} name
 * @property {TableField[]} fields
 * @property {TableRecord[]} records
 * @property {TableView[]} views
 */

/**
 * Create a base table.
 * @param {string} name
 * @param {Partial<BaseTable>} [overrides={}]
 * @returns {BaseTable}
 */
export function createTable(name = 'Table 1', overrides = {}) {
  const tableId = overrides.id || generateId('tbl')
  return {
    id: tableId,
    name: overrides.name || name,
    fields: overrides.fields || [],
    records: overrides.records || [],
    views: overrides.views || [createView('Grid view', VIEW_TYPES.GRID)],
  }
}

/**
 * @typedef {Object} RelationalBase
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {BaseTable[]} tables
 * @property {number} createdAt
 * @property {number} updatedAt
 */

/**
 * Create a starter relational base with sample Projects and Tasks tables.
 * @param {Partial<RelationalBase>} [overrides={}]
 * @returns {RelationalBase}
 */
export function createBase(overrides = {}) {
  const baseId = overrides.id || generateId('base')
  const now = Date.now()

  // Table 1: Projects
  const fName = createField('Project Name', FIELD_TYPES.TEXT)
  const fStatus = createField('Status', FIELD_TYPES.SELECT, {
    options: [
      { id: 'opt-planned', label: 'Planned', color: '#64748b' },
      { id: 'opt-active', label: 'Active', color: '#2563eb' },
      { id: 'opt-done', label: 'Completed', color: '#16a34a' },
    ],
  })
  const fBudget = createField('Budget ($)', FIELD_TYPES.NUMBER)
  const fDueDate = createField('Due Date', FIELD_TYPES.DATE)
  const fDone = createField('Completed', FIELD_TYPES.CHECKBOX)

  const projectsTable = createTable('Projects', {
    id: 'tbl-projects',
    fields: [fName, fStatus, fBudget, fDueDate, fDone],
    records: [
      createRecord({
        [fName.id]: 'Zoffice Core Suite',
        [fStatus.id]: 'Active',
        [fBudget.id]: 25000,
        [fDueDate.id]: '2026-11-15',
        [fDone.id]: false,
      }),
      createRecord({
        [fName.id]: 'Offline SQLite Pipeline',
        [fStatus.id]: 'Completed',
        [fBudget.id]: 12000,
        [fDueDate.id]: '2026-10-24',
        [fDone.id]: true,
      }),
      createRecord({
        [fName.id]: 'Relational ZBase Engine',
        [fStatus.id]: 'Active',
        [fBudget.id]: 18500,
        [fDueDate.id]: '2026-12-01',
        [fDone.id]: false,
      }),
    ],
    views: [
      createView('All Projects', VIEW_TYPES.GRID),
      createView('Status Board', VIEW_TYPES.KANBAN, { groupByFieldId: fStatus.id }),
      createView('Project Schedule', VIEW_TYPES.CALENDAR),
      createView('Project Cards', VIEW_TYPES.GALLERY),
      createView('Submit Project', VIEW_TYPES.FORM),
    ],
  })

  // Table 2: Team Members
  const fMember = createField('Full Name', FIELD_TYPES.TEXT)
  const fRole = createField('Role', FIELD_TYPES.TEXT)
  const fEmail = createField('Email', FIELD_TYPES.TEXT)

  const teamTable = createTable('Team', {
    id: 'tbl-team',
    fields: [fMember, fRole, fEmail],
    records: [
      createRecord({
        [fMember.id]: 'Alice Engineer',
        [fRole.id]: 'Lead Architect',
        [fEmail.id]: 'alice@zoffice.local',
      }),
      createRecord({
        [fMember.id]: 'Bob Designer',
        [fRole.id]: 'UI/UX Specialist',
        [fEmail.id]: 'bob@zoffice.local',
      }),
    ],
    views: [createView('Team Directory', VIEW_TYPES.GRID)],
  })

  return {
    id: baseId,
    title: overrides.title || 'Company Database',
    description: overrides.description || 'Relational tracking for projects and team',
    tables: overrides.tables || [projectsTable, teamTable],
    createdAt: overrides.createdAt || now,
    updatedAt: overrides.updatedAt || now,
  }
}
