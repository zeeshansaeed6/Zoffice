/**
 * ZBase Form View Component — responsive form for offline record entry.
 * @module FormView
 */

import React, { useState } from 'react'
import { Send, CheckCircle2, RotateCcw } from 'lucide-react'
import { FIELD_TYPES } from '../core/constants.js'

/**
 * @param {Object} props
 * @param {import('../core/base-model.js').BaseTable} props.table
 * @param {(tableId: string, fields: Record<string, any>) => void} props.onAddRecord
 */
export function FormView({ table, onAddRecord }) {
  const [formData, setFormData] = useState({})
  const [submitted, setSubmitted] = useState(false)

  // Fields suitable for user input (skip computed formula/lookup/rollup)
  const editableFields = table.fields.filter(
    (f) =>
      f.type !== FIELD_TYPES.FORMULA &&
      f.type !== FIELD_TYPES.LOOKUP &&
      f.type !== FIELD_TYPES.ROLLUP,
  )

  const handleChange = (fieldId, val) => {
    setFormData((prev) => ({ ...prev, [fieldId]: val }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onAddRecord(table.id, formData)
    setSubmitted(true)
  }

  const handleReset = () => {
    setFormData({})
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-slate-50 p-6 text-center dark:bg-slate-900">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-950/60 dark:text-green-400">
          <CheckCircle2 size={36} />
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
          Response Submitted!
        </h3>
        <p className="max-w-md text-xs text-slate-500">
          Your record has been successfully saved to table &ldquo;{table.name}&rdquo;.
        </p>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700"
        >
          <RotateCcw size={14} /> Submit Another Record
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full justify-center overflow-y-auto bg-slate-100/60 p-6 dark:bg-slate-900/60">
      <div className="h-fit w-full max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-6 border-b border-slate-100 pb-4 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            {table.name} Form
          </h2>
          <p className="mt-1 text-xs text-slate-500">Submit a new record offline to this table.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {editableFields.map((field) => (
            <div key={field.id} className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {field.name}
              </label>

              {field.type === FIELD_TYPES.CHECKBOX ? (
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(formData[field.id])}
                    onChange={(e) => handleChange(field.id, e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-400">Yes / Checked</span>
                </label>
              ) : field.type === FIELD_TYPES.SELECT && field.options?.length ? (
                <select
                  value={formData[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  <option value="">Select option...</option>
                  {field.options.map((opt) => (
                    <option key={opt.id} value={opt.label}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === FIELD_TYPES.DATE ? (
                <input
                  type="date"
                  value={formData[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                />
              ) : (
                <input
                  type={field.type === FIELD_TYPES.NUMBER ? 'number' : 'text'}
                  value={formData[field.id] ?? ''}
                  onChange={(e) =>
                    handleChange(
                      field.id,
                      field.type === FIELD_TYPES.NUMBER ? Number(e.target.value) : e.target.value,
                    )
                  }
                  placeholder={`Enter ${field.name.toLowerCase()}...`}
                  className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                />
              )}
            </div>
          ))}

          <div className="mt-4 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-md px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Clear
            </button>
            <button
              type="submit"
              className="shadow-xs flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
            >
              <Send size={13} /> Submit Record
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
