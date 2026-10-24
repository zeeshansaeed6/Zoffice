/**
 * ZBase Main Application Component.
 * Relational database application with Grid, Kanban, Calendar, Gallery, and Form views.
 * @module ZBase
 */

import React, { useMemo, useCallback } from 'react'
import { Ribbon, StatusBar, StatusBarSlot } from '@zoffice/ui'
import { Database, Columns, Hash } from 'lucide-react'
import { getBaseRibbonConfig } from './ribbon-config.jsx'
import { useBaseStore } from './core/base-store.js'
import { VIEW_TYPES } from './core/constants.js'
import { TableNavTabs } from './components/TableNavTabs.jsx'
import { ViewSearchBar } from './components/ViewSearchBar.jsx'
import { GridView } from './views/GridView.jsx'
import { KanbanView } from './views/KanbanView.jsx'
import { GalleryView } from './views/GalleryView.jsx'
import { CalendarView } from './views/CalendarView.jsx'
import { FormView } from './views/FormView.jsx'
import { FieldModal } from './dialogs/FieldModal.jsx'
import { RecordDetailModal } from './dialogs/RecordDetailModal.jsx'
import { SqlQueryConsoleModal } from './dialogs/SqlQueryConsoleModal.jsx'

/**
 * @param {Object} props
 * @param {string} [props.id]
 * @param {string} [props.title='ZBase']
 * @param {string} [props.initialContent='']
 * @param {(content: string) => void} [props.onChange]
 * @param {(content?: string) => void} [props.onSave]
 */
export function ZBase({
  id: _id,
  title: _title = 'ZBase',
  initialContent: _initialContent = '',
  onChange: _onChange,
  onSave: _onSave,
}) {
  const {
    base,
    activeTableId,
    activeViewId,
    searchQuery,
    isFieldModalOpen,
    editingField,
    isRecordModalOpen,
    editingRecord,
    isSqlConsoleOpen,
    setActiveTable,
    setActiveView,
    addTable,
    addView,
    setSearchQuery,
    openFieldModal,
    closeFieldModal,
    openRecordModal,
    closeRecordModal,
    openSqlConsole,
    closeSqlConsole,
    addField,
    updateField,
    deleteField,
    addRecord,
    updateRecord,
    deleteRecord,
  } = useBaseStore()

  const activeTable = useMemo(() => {
    return base.tables.find((t) => t.id === activeTableId) || base.tables[0]
  }, [base.tables, activeTableId])

  const activeView = useMemo(() => {
    if (!activeTable) return null
    return activeTable.views.find((v) => v.id === activeViewId) || activeTable.views[0]
  }, [activeTable, activeViewId])

  const handleExportCsv = useCallback(() => {
    if (!activeTable) return
    const headers = activeTable.fields.map((f) => `"${f.name.replace(/"/g, '""')}"`).join(',')
    const rows = activeTable.records.map((rec) =>
      activeTable.fields
        .map((f) => {
          const val = rec.fields[f.id] ?? ''
          return `"${String(val).replace(/"/g, '""')}"`
        })
        .join(','),
    )
    const csvContent = [headers, ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${activeTable.name.toLowerCase().replace(/\s+/g, '_')}_export.csv`
    link.click()
    URL.revokeObjectURL(url)
  }, [activeTable])

  const handleSwitchViewType = useCallback(
    (viewType) => {
      if (!activeTable) return
      const existing = activeTable.views.find((v) => v.type === viewType)
      if (existing) {
        setActiveView(existing.id)
      } else {
        const typeLabels = {
          [VIEW_TYPES.GRID]: 'Grid',
          [VIEW_TYPES.KANBAN]: 'Kanban',
          [VIEW_TYPES.CALENDAR]: 'Calendar',
          [VIEW_TYPES.GALLERY]: 'Gallery',
          [VIEW_TYPES.FORM]: 'Form',
        }
        addView(activeTable.id, `${typeLabels[viewType]} view`, viewType)
      }
    },
    [activeTable, setActiveView, addView],
  )

  const ribbonActions = useMemo(() => {
    return {
      onAddRecord: () => addRecord(activeTable.id),
      onAddField: () => openFieldModal(),
      onOpenSqlConsole: openSqlConsole,
      onExportCsv: handleExportCsv,
      onSwitchViewType: handleSwitchViewType,
      onSave: () => {},
    }
  }, [
    activeTable.id,
    addRecord,
    openFieldModal,
    openSqlConsole,
    handleExportCsv,
    handleSwitchViewType,
  ])

  const ribbonConfig = useMemo(() => {
    return getBaseRibbonConfig(ribbonActions, activeView?.type || VIEW_TYPES.GRID)
  }, [ribbonActions, activeView?.type])

  return (
    <div
      data-testid="zbase-app"
      className="flex h-full w-full flex-col bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-100"
    >
      <Ribbon {...ribbonConfig} />

      <TableNavTabs
        tables={base.tables}
        activeTableId={activeTable?.id}
        onSelectTable={setActiveTable}
        onAddTable={addTable}
      />

      <ViewSearchBar
        views={activeTable?.views || []}
        activeViewId={activeView?.id}
        searchQuery={searchQuery}
        onSelectView={setActiveView}
        onSearchChange={setSearchQuery}
        onOpenSqlConsole={openSqlConsole}
      />

      <div className="flex-1 overflow-hidden">
        {activeView?.type === VIEW_TYPES.GRID && activeTable && (
          <GridView
            table={activeTable}
            tables={base.tables}
            searchQuery={searchQuery}
            onUpdateRecord={updateRecord}
            onAddRecord={addRecord}
            onDeleteRecord={deleteRecord}
            onOpenFieldModal={openFieldModal}
            onDeleteField={deleteField}
            onOpenRecordModal={openRecordModal}
          />
        )}
        {activeView?.type === VIEW_TYPES.KANBAN && activeTable && (
          <KanbanView
            table={activeTable}
            searchQuery={searchQuery}
            onAddRecord={addRecord}
            onOpenRecordModal={openRecordModal}
          />
        )}
        {activeView?.type === VIEW_TYPES.GALLERY && activeTable && (
          <GalleryView
            table={activeTable}
            searchQuery={searchQuery}
            onAddRecord={addRecord}
            onOpenRecordModal={openRecordModal}
          />
        )}
        {activeView?.type === VIEW_TYPES.CALENDAR && activeTable && (
          <CalendarView
            table={activeTable}
            searchQuery={searchQuery}
            onOpenFieldModal={openFieldModal}
            onOpenRecordModal={openRecordModal}
          />
        )}
        {activeView?.type === VIEW_TYPES.FORM && activeTable && (
          <FormView table={activeTable} onAddRecord={addRecord} />
        )}
      </div>

      <StatusBar>
        <StatusBarSlot>
          <Database size={12} className="mr-1 inline text-blue-500" />
          {base.title} &bull; {activeTable?.name}
        </StatusBarSlot>
        <StatusBarSlot>
          <Hash size={12} className="mr-1 inline text-slate-400" />
          {activeTable?.records.length || 0} Records
        </StatusBarSlot>
        <StatusBarSlot>
          <Columns size={12} className="mr-1 inline text-slate-400" />
          {activeTable?.fields.length || 0} Fields
        </StatusBarSlot>
        <StatusBarSlot>Offline Ready</StatusBarSlot>
      </StatusBar>

      <FieldModal
        isOpen={isFieldModalOpen}
        field={editingField}
        activeTable={activeTable}
        tables={base.tables}
        onSave={(data) => {
          if (editingField) {
            updateField(activeTable.id, editingField.id, data)
          } else {
            addField(activeTable.id, data)
          }
        }}
        onClose={closeFieldModal}
      />

      <RecordDetailModal
        isOpen={isRecordModalOpen}
        record={editingRecord}
        table={activeTable}
        onUpdateRecord={updateRecord}
        onDeleteRecord={deleteRecord}
        onClose={closeRecordModal}
      />

      <SqlQueryConsoleModal
        isOpen={isSqlConsoleOpen}
        tables={base.tables}
        onClose={closeSqlConsole}
      />
    </div>
  )
}
