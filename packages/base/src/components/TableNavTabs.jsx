/**
 * ZBase Table Navigation Tabs Component.
 * @module TableNavTabs
 */

import React from 'react'
import { Database, Table as TableIcon, Plus } from 'lucide-react'

/**
 * @param {Object} props
 * @param {import('../core/base-model.js').BaseTable[]} props.tables
 * @param {string} props.activeTableId
 * @param {(tableId: string) => void} props.onSelectTable
 * @param {(name: string) => void} props.onAddTable
 */
export function TableNavTabs({
  tables,
  activeTableId,
  onSelectTable,
  onAddTable,
}) {
  return (
    <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-100/90 px-4 pt-1.5 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center gap-1.5 pr-2 text-xs font-semibold text-slate-500">
        <Database size={13} className="text-blue-500" />
        <span>Tables:</span>
      </div>
      {tables.map((table) => {
        const isActive = table.id === activeTableId
        return (
          <button
            key={table.id}
            onClick={() => onSelectTable(table.id)}
            className={`flex items-center gap-1.5 rounded-t-md px-3 py-1.5 text-xs font-medium transition ${
              isActive
                ? 'border-t-2 border-blue-600 bg-white text-blue-600 shadow-xs dark:bg-slate-900 dark:text-blue-400'
                : 'text-slate-600 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            <TableIcon size={12} />
            <span>{table.name}</span>
          </button>
        )
      })}
      <button
        onClick={() => onAddTable('Table ' + (tables.length + 1))}
        className="flex items-center gap-1 rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
        title="Add table"
      >
        <Plus size={13} />
      </button>
    </div>
  )
}
