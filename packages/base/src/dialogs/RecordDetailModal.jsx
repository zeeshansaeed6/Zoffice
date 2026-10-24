/**
 * ZBase Record Detail Modal — inspect and update single record values.
 * @module RecordDetailModal
 */

import React, { useState } from 'react'
import { X, Trash2, Check } from 'lucide-react'
import { FIELD_TYPES } from '../core/constants.js'

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {import('../core/base-model.js').TableRecord|null} props.record
 * @param {import('../core/base-model.js').BaseTable} props.table
 * @param {(tableId: string, recordId: string, fieldId: string, value: any) => void} props.onUpdateRecord
 * @param {(tableId: string, recordId: string) => void} props.onDeleteRecord
 * @param {() => void} props.onClose
 */
export function RecordDetailModal({
  isOpen,
  record,
  table,
  onUpdateRecord,
  onDeleteRecord,
  onClose,
}) {
  if (!isOpen || !record) return null

  const [fieldValues, setFieldValues] = useState({ ...record.fields })

  const handleValueChange = (fieldId, val) => {
    setFieldValues((prev) => ({ ...prev, [fieldId]: val }))
    onUpdateRecord(table.id, record.id, fieldId, val)
  }

  const handleDelete = () => {
    onDeleteRecord(table.id, record.id)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Record Details
            </span>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {record.fields[table.fields[0]?.id] || 'Record #' + record.id.slice(-6)}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={16} />
          </button>
        </div>

        {/* Fields list */}
        <div className="flex flex-1 flex-col gap-3.5 overflow-y-auto p-5">
          {table.fields.map((field) => {
            const val = fieldValues[field.id]

            return (
              <div key={field.id} className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {field.name}
                </span>

                {field.type === FIELD_TYPES.CHECKBOX ? (
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={Boolean(val)}
                      onChange={(e) => handleValueChange(field.id, e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs text-slate-700 dark:text-slate-300">Checked</span>
                  </label>
                ) : field.type === FIELD_TYPES.SELECT && field.options?.length ? (
                  <select
                    value={val || ''}
                    onChange={(e) => handleValueChange(field.id, e.target.value)}
                    className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                  >
                    <option value="">(None)</option>
                    {field.options.map((opt) => (
                      <option key={opt.id} value={opt.label}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === FIELD_TYPES.DATE ? (
                  <input
                    type="date"
                    value={val || ''}
                    onChange={(e) => handleValueChange(field.id, e.target.value)}
                    className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                  />
                ) : (
                  <input
                    type={field.type === FIELD_TYPES.NUMBER ? 'number' : 'text'}
                    value={val ?? ''}
                    onChange={(e) =>
                      handleValueChange(
                        field.id,
                        field.type === FIELD_TYPES.NUMBER ? Number(e.target.value) : e.target.value,
                      )
                    }
                    className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 dark:border-slate-800">
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <Trash2 size={13} /> Delete Record
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
          >
            <Check size={14} /> Done
          </button>
        </div>
      </div>
    </div>
  )
}
