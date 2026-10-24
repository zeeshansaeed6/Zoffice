/**
 * ZBase Zustand State Store.
 * @module base-store
 */

import { create } from 'zustand'
import { createBase, createTable, createField, createRecord, createView } from './base-model.js'
import { saveBaseToStorage, loadBaseFromStorage } from './base-storage.js'
import { VIEW_TYPES } from './constants.js'

/**
 * @typedef {Object} BaseStore
 * @property {import('./base-model.js').RelationalBase} base
 * @property {string} activeTableId
 * @property {string} activeViewId
 * @property {string} searchQuery
 * @property {boolean} isFieldModalOpen
 * @property {import('./base-model.js').TableField|null} editingField
 * @property {boolean} isRecordModalOpen
 * @property {import('./base-model.js').TableRecord|null} editingRecord
 * @property {boolean} isSqlConsoleOpen
 */

export const useBaseStore = create((set, get) => {
  const initialBase = createBase()
  const initialTable = initialBase.tables[0]
  const initialView = initialTable.views[0]

  return {
    base: initialBase,
    activeTableId: initialTable.id,
    activeViewId: initialView.id,
    searchQuery: '',
    isFieldModalOpen: false,
    editingField: null,
    isRecordModalOpen: false,
    editingRecord: null,
    isSqlConsoleOpen: false,

    setSearchQuery: (query) => set({ searchQuery: query }),
    openFieldModal: (field = null) => set({ isFieldModalOpen: true, editingField: field }),
    closeFieldModal: () => set({ isFieldModalOpen: false, editingField: null }),
    openRecordModal: (record = null) => set({ isRecordModalOpen: true, editingRecord: record }),
    closeRecordModal: () => set({ isRecordModalOpen: false, editingRecord: null }),
    openSqlConsole: () => set({ isSqlConsoleOpen: true }),
    closeSqlConsole: () => set({ isSqlConsoleOpen: false }),

    setActiveTable: (tableId) => {
      const { base } = get()
      const table = base.tables.find((t) => t.id === tableId)
      if (table) {
        set({
          activeTableId: tableId,
          activeViewId: table.views[0]?.id || '',
        })
      }
    },

    setActiveView: (viewId) => set({ activeViewId: viewId }),

    updateTitle: (title) => {
      set((state) => {
        const nextBase = { ...state.base, title, updatedAt: Date.now() }
        saveBaseToStorage(nextBase)
        return { base: nextBase }
      })
    },

    addTable: (name = 'New Table') => {
      set((state) => {
        const defaultField = createField('Name')
        const newTable = createTable(name, { fields: [defaultField] })
        const nextBase = {
          ...state.base,
          tables: [...state.base.tables, newTable],
          updatedAt: Date.now(),
        }
        saveBaseToStorage(nextBase)
        return {
          base: nextBase,
          activeTableId: newTable.id,
          activeViewId: newTable.views[0].id,
        }
      })
    },

    deleteTable: (tableId) => {
      set((state) => {
        if (state.base.tables.length <= 1) return state
        const nextTables = state.base.tables.filter((t) => t.id !== tableId)
        const nextActive = nextTables[0]
        const nextBase = { ...state.base, tables: nextTables, updatedAt: Date.now() }
        saveBaseToStorage(nextBase)
        return {
          base: nextBase,
          activeTableId: nextActive.id,
          activeViewId: nextActive.views[0]?.id || '',
        }
      })
    },

    addView: (tableId, name, type = VIEW_TYPES.GRID) => {
      set((state) => {
        const nextTables = state.base.tables.map((t) => {
          if (t.id !== tableId) return t
          const view = createView(name, type)
          return { ...t, views: [...t.views, view] }
        })
        const nextBase = { ...state.base, tables: nextTables, updatedAt: Date.now() }
        saveBaseToStorage(nextBase)
        const updatedTable = nextTables.find((t) => t.id === tableId)
        const newView = updatedTable.views[updatedTable.views.length - 1]
        return { base: nextBase, activeViewId: newView.id }
      })
    },

    deleteView: (tableId, viewId) => {
      set((state) => {
        const nextTables = state.base.tables.map((t) => {
          if (t.id !== tableId || t.views.length <= 1) return t
          return { ...t, views: t.views.filter((v) => v.id !== viewId) }
        })
        const nextBase = { ...state.base, tables: nextTables, updatedAt: Date.now() }
        saveBaseToStorage(nextBase)
        const activeTable = nextTables.find((t) => t.id === tableId)
        return {
          base: nextBase,
          activeViewId: activeTable.views[0]?.id || '',
        }
      })
    },

    addField: (tableId, fieldData) => {
      set((state) => {
        const newField = createField(fieldData.name, fieldData.type, fieldData)
        const nextTables = state.base.tables.map((t) => {
          if (t.id !== tableId) return t
          return { ...t, fields: [...t.fields, newField] }
        })
        const nextBase = { ...state.base, tables: nextTables, updatedAt: Date.now() }
        saveBaseToStorage(nextBase)
        return { base: nextBase }
      })
    },

    updateField: (tableId, fieldId, updates) => {
      set((state) => {
        const nextTables = state.base.tables.map((t) => {
          if (t.id !== tableId) return t
          return {
            ...t,
            fields: t.fields.map((f) => (f.id === fieldId ? { ...f, ...updates } : f)),
          }
        })
        const nextBase = { ...state.base, tables: nextTables, updatedAt: Date.now() }
        saveBaseToStorage(nextBase)
        return { base: nextBase }
      })
    },

    deleteField: (tableId, fieldId) => {
      set((state) => {
        const nextTables = state.base.tables.map((t) => {
          if (t.id !== tableId || t.fields.length <= 1) return t
          const nextFields = t.fields.filter((f) => f.id !== fieldId)
          const nextRecords = t.records.map((r) => {
            const { [fieldId]: _, ...remaining } = r.fields
            return { ...r, fields: remaining }
          })
          return { ...t, fields: nextFields, records: nextRecords }
        })
        const nextBase = { ...state.base, tables: nextTables, updatedAt: Date.now() }
        saveBaseToStorage(nextBase)
        return { base: nextBase }
      })
    },

    addRecord: (tableId, recordFields = {}) => {
      const newRec = createRecord(recordFields)
      set((state) => {
        const nextTables = state.base.tables.map((t) => {
          if (t.id !== tableId) return t
          return { ...t, records: [...t.records, newRec] }
        })
        const nextBase = { ...state.base, tables: nextTables, updatedAt: Date.now() }
        saveBaseToStorage(nextBase)
        return { base: nextBase }
      })
      return newRec
    },

    updateRecord: (tableId, recordId, fieldId, value) => {
      set((state) => {
        const nextTables = state.base.tables.map((t) => {
          if (t.id !== tableId) return t
          return {
            ...t,
            records: t.records.map((r) => {
              if (r.id !== recordId) return r
              return {
                ...r,
                fields: { ...r.fields, [fieldId]: value },
                updatedAt: Date.now(),
              }
            }),
          }
        })
        const nextBase = { ...state.base, tables: nextTables, updatedAt: Date.now() }
        saveBaseToStorage(nextBase)
        return { base: nextBase }
      })
    },

    deleteRecord: (tableId, recordId) => {
      set((state) => {
        const nextTables = state.base.tables.map((t) => {
          if (t.id !== tableId) return t
          return { ...t, records: t.records.filter((r) => r.id !== recordId) }
        })
        const nextBase = { ...state.base, tables: nextTables, updatedAt: Date.now() }
        saveBaseToStorage(nextBase)
        return { base: nextBase }
      })
    },

    loadBase: async (id) => {
      const loaded = await loadBaseFromStorage(id)
      if (loaded) {
        set({
          base: loaded,
          activeTableId: loaded.tables[0]?.id || '',
          activeViewId: loaded.tables[0]?.views[0]?.id || '',
        })
      }
    },
  }
})
