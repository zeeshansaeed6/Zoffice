import { describe, it, expect, beforeEach } from 'vitest'
import { useBaseStore } from '../core/base-store.js'
import { FIELD_TYPES, VIEW_TYPES } from '../core/constants.js'

describe('ZBase Zustand Store', () => {
  beforeEach(() => {
    // Reset store state
    useBaseStore.setState(useBaseStore.getInitialState())
  })

  it('initializes with default base and active table', () => {
    const state = useBaseStore.getState()
    expect(state.base.tables.length).toBeGreaterThanOrEqual(2)
    expect(state.activeTableId).toBe(state.base.tables[0].id)
    expect(state.activeViewId).toBe(state.base.tables[0].views[0].id)
  })

  it('switches active table and active view', () => {
    const { base, setActiveTable, setActiveView } = useBaseStore.getState()
    const secondTable = base.tables[1]

    setActiveTable(secondTable.id)
    expect(useBaseStore.getState().activeTableId).toBe(secondTable.id)

    setActiveView('custom-view-id')
    expect(useBaseStore.getState().activeViewId).toBe('custom-view-id')
  })

  it('adds and deletes tables', () => {
    const { addTable, deleteTable } = useBaseStore.getState()
    addTable('Tasks')

    let state = useBaseStore.getState()
    const added = state.base.tables.find((t) => t.name === 'Tasks')
    expect(added).toBeDefined()
    expect(state.activeTableId).toBe(added.id)

    deleteTable(added.id)
    state = useBaseStore.getState()
    expect(state.base.tables.find((t) => t.id === added.id)).toBeUndefined()
  })

  it('adds and updates fields in active table', () => {
    const { activeTableId, addField, updateField } = useBaseStore.getState()
    addField(activeTableId, { name: 'Priority', type: FIELD_TYPES.SELECT })

    let state = useBaseStore.getState()
    const table = state.base.tables.find((t) => t.id === activeTableId)
    const field = table.fields.find((f) => f.name === 'Priority')
    expect(field).toBeDefined()
    expect(field.type).toBe(FIELD_TYPES.SELECT)

    updateField(activeTableId, field.id, { name: 'Urgency' })
    state = useBaseStore.getState()
    const updated = state.base.tables
      .find((t) => t.id === activeTableId)
      .fields.find((f) => f.id === field.id)
    expect(updated.name).toBe('Urgency')
  })

  it('adds, updates, and deletes records', () => {
    const { activeTableId, addRecord, updateRecord, deleteRecord } = useBaseStore.getState()
    const table = useBaseStore.getState().base.tables.find((t) => t.id === activeTableId)
    const firstField = table.fields[0]

    const record = addRecord(activeTableId, { [firstField.id]: 'Special Task' })
    let state = useBaseStore.getState()
    let currentTable = state.base.tables.find((t) => t.id === activeTableId)
    expect(currentTable.records.find((r) => r.id === record.id)).toBeDefined()

    updateRecord(activeTableId, record.id, firstField.id, 'Updated Task')
    state = useBaseStore.getState()
    currentTable = state.base.tables.find((t) => t.id === activeTableId)
    expect(currentTable.records.find((r) => r.id === record.id).fields[firstField.id]).toBe(
      'Updated Task',
    )

    deleteRecord(activeTableId, record.id)
    state = useBaseStore.getState()
    currentTable = state.base.tables.find((t) => t.id === activeTableId)
    expect(currentTable.records.find((r) => r.id === record.id)).toBeUndefined()
  })

  it('adds views to table', () => {
    const { activeTableId, addView } = useBaseStore.getState()
    addView(activeTableId, 'New Kanban View', VIEW_TYPES.KANBAN)

    const state = useBaseStore.getState()
    const table = state.base.tables.find((t) => t.id === activeTableId)
    const kanbanView = table.views.find((v) => v.name === 'New Kanban View')
    expect(kanbanView).toBeDefined()
    expect(kanbanView.type).toBe(VIEW_TYPES.KANBAN)
    expect(state.activeViewId).toBe(kanbanView.id)
  })

  it('manages modal and search query state', () => {
    const { setSearchQuery, openFieldModal, closeFieldModal, openSqlConsole, closeSqlConsole } =
      useBaseStore.getState()

    setSearchQuery('test query')
    expect(useBaseStore.getState().searchQuery).toBe('test query')

    openFieldModal()
    expect(useBaseStore.getState().isFieldModalOpen).toBe(true)

    closeFieldModal()
    expect(useBaseStore.getState().isFieldModalOpen).toBe(false)

    openSqlConsole()
    expect(useBaseStore.getState().isSqlConsoleOpen).toBe(true)

    closeSqlConsole()
    expect(useBaseStore.getState().isSqlConsoleOpen).toBe(false)
  })
})
