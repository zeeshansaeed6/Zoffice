/**
 * ZBase Gallery View Component — card grid layout for base records.
 * @module GalleryView
 */

import React, { useMemo } from 'react'
import { Plus, Calendar, Hash, Tag, CheckCircle2 } from 'lucide-react'
import { FIELD_TYPES } from '../core/constants.js'

/**
 * @param {Object} props
 * @param {import('../core/base-model.js').BaseTable} props.table
 * @param {string} props.searchQuery
 * @param {(tableId: string, fields?: Record<string, any>) => void} props.onAddRecord
 * @param {(record: any) => void} props.onOpenRecordModal
 */
export function GalleryView({ table, searchQuery, onAddRecord, onOpenRecordModal }) {
  const primaryField = useMemo(() => {
    return table.fields.find((f) => f.type === FIELD_TYPES.TEXT) || table.fields[0]
  }, [table.fields])

  const otherFields = useMemo(() => {
    return table.fields.filter((f) => f.id !== primaryField?.id)
  }, [table.fields, primaryField])

  // Filter records by search query
  const records = useMemo(() => {
    if (!searchQuery) return table.records
    const query = searchQuery.toLowerCase()
    return table.records.filter((rec) =>
      Object.values(rec.fields).some((val) => String(val).toLowerCase().includes(query)),
    )
  }, [table.records, searchQuery])

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-slate-50 p-6 dark:bg-slate-900">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {records.map((record) => {
          const title = record.fields[primaryField?.id] || 'Untitled'
          return (
            <div
              key={record.id}
              onClick={() => onOpenRecordModal(record)}
              className="shadow-xs group flex cursor-pointer flex-col justify-between rounded-lg border border-slate-200 bg-white p-4 transition hover:border-blue-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-500"
            >
              <div>
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {title}
                </h4>

                <div className="mt-3 flex flex-col gap-2">
                  {otherFields.map((field) => {
                    const val = record.fields[field.id]
                    if (val === undefined || val === null || val === '') return null

                    if (field.type === FIELD_TYPES.CHECKBOX) {
                      return (
                        <div
                          key={field.id}
                          className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300"
                        >
                          <CheckCircle2
                            size={13}
                            className={
                              val ? 'text-green-500' : 'text-slate-300 dark:text-slate-600'
                            }
                          />
                          <span>{field.name}</span>
                        </div>
                      )
                    }

                    if (field.type === FIELD_TYPES.SELECT) {
                      return (
                        <div key={field.id} className="flex items-center gap-1.5 text-xs">
                          <Tag size={12} className="text-purple-500" />
                          <span className="rounded bg-purple-100 px-2 py-0.5 text-[11px] font-medium text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                            {String(val)}
                          </span>
                        </div>
                      )
                    }

                    return (
                      <div
                        key={field.id}
                        className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400"
                      >
                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          {field.type === FIELD_TYPES.DATE ? (
                            <Calendar size={11} className="text-amber-500" />
                          ) : (
                            <Hash size={11} className="text-blue-500" />
                          )}
                          {field.name}
                        </span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {String(val)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-2 text-[10px] text-slate-400 dark:border-slate-800">
                Updated {new Date(record.updatedAt || Date.now()).toLocaleDateString()}
              </div>
            </div>
          )
        })}

        {/* Add Record Card */}
        <button
          onClick={() => onAddRecord(table.id)}
          className="flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-white/50 text-slate-400 transition hover:border-blue-400 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-blue-500 dark:hover:text-blue-400"
        >
          <Plus size={24} />
          <span className="text-xs font-medium">Add New Record</span>
        </button>
      </div>
    </div>
  )
}
