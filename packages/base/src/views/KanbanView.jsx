/**
 * ZBase Kanban View Component — board view grouped by select field options.
 * @module KanbanView
 */

import React, { useMemo } from 'react'
import { Plus, MoreHorizontal, Calendar, Hash } from 'lucide-react'
import { FIELD_TYPES } from '../core/constants.js'

/**
 * @param {Object} props
 * @param {import('../core/base-model.js').BaseTable} props.table
 * @param {string} props.searchQuery
 * @param {(tableId: string, fields?: Record<string, any>) => void} props.onAddRecord
 * @param {(record: any) => void} props.onOpenRecordModal
 */
export function KanbanView({
  table,
  searchQuery,
  onAddRecord,
  onOpenRecordModal,
}) {
  // Find group-by select field
  const selectField = useMemo(() => {
    return (
      table.fields.find((f) => f.type === FIELD_TYPES.SELECT) ||
      table.fields.find((f) => f.type === FIELD_TYPES.TEXT)
    )
  }, [table.fields])

  // Get primary title field (first text field)
  const titleField = useMemo(() => {
    return table.fields.find((f) => f.type === FIELD_TYPES.TEXT) || table.fields[0]
  }, [table.fields])

  // Secondary fields (number, date)
  const metaFields = useMemo(() => {
    return table.fields.filter(
      (f) =>
        f.id !== titleField?.id &&
        f.id !== selectField?.id &&
        (f.type === FIELD_TYPES.NUMBER || f.type === FIELD_TYPES.DATE),
    )
  }, [table.fields, titleField, selectField])

  // Filter records by search query
  const records = useMemo(() => {
    if (!searchQuery) return table.records
    const query = searchQuery.toLowerCase()
    return table.records.filter((rec) =>
      Object.values(rec.fields).some((val) =>
        String(val).toLowerCase().includes(query),
      ),
    )
  }, [table.records, searchQuery])

  // Group columns
  const columns = useMemo(() => {
    if (selectField?.type === FIELD_TYPES.SELECT && selectField.options?.length) {
      const cols = selectField.options.map((opt) => ({
        id: opt.id,
        label: opt.label,
        color: opt.color || '#64748b',
        records: records.filter((r) => r.fields[selectField.id] === opt.label),
      }))

      // Uncategorized column
      const uncategorized = records.filter(
        (r) =>
          !r.fields[selectField.id] ||
          !selectField.options.some((opt) => opt.label === r.fields[selectField.id]),
      )
      if (uncategorized.length > 0) {
        cols.push({
          id: 'uncategorized',
          label: 'No ' + selectField.name,
          color: '#94a3b8',
          records: uncategorized,
        })
      }
      return cols
    }

    // Default fallback columns
    return [
      {
        id: 'all-records',
        label: 'All Records',
        color: '#3b82f6',
        records,
      },
    ]
  }, [selectField, records])

  return (
    <div className="flex h-full w-full gap-4 overflow-x-auto bg-slate-100/70 p-4 dark:bg-slate-900/50">
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex w-72 flex-shrink-0 flex-col rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
        >
          {/* Column Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2.5 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: column.color }}
              />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {column.label}
              </span>
              <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                {column.records.length}
              </span>
            </div>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreHorizontal size={14} />
            </button>
          </div>

          {/* Cards List */}
          <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2">
            {column.records.map((record) => {
              const title = record.fields[titleField?.id] || 'Untitled'
              return (
                <div
                  key={record.id}
                  onClick={() => onOpenRecordModal(record)}
                  className="cursor-pointer rounded border border-slate-200 bg-white p-3 shadow-xs transition hover:border-blue-400 hover:shadow dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-500"
                >
                  <p className="text-xs font-medium text-slate-900 dark:text-slate-100">
                    {title}
                  </p>

                  {/* Meta items */}
                  {metaFields.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-2 border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-slate-800 dark:text-slate-400">
                      {metaFields.map((f) => {
                        const val = record.fields[f.id]
                        if (val === undefined || val === null || val === '') return null
                        return (
                          <span key={f.id} className="flex items-center gap-1">
                            {f.type === FIELD_TYPES.DATE ? (
                              <Calendar size={11} className="text-amber-500" />
                            ) : (
                              <Hash size={11} className="text-blue-500" />
                            )}
                            <span>{String(val)}</span>
                          </span>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Quick add card */}
            <button
              onClick={() => {
                const initial = {}
                if (selectField && column.id !== 'uncategorized') {
                  initial[selectField.id] = column.label
                }
                onAddRecord(table.id, initial)
              }}
              className="flex items-center gap-1.5 rounded border border-dashed border-slate-300 p-2 text-xs font-medium text-slate-500 hover:border-slate-400 hover:text-slate-700 dark:border-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <Plus size={13} /> Add card
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
