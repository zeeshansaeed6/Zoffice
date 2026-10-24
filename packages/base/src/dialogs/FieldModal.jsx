/**
 * ZBase Field Configuration Modal — add or edit table fields.
 * @module FieldModal
 */

import React, { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { FIELD_TYPES, SELECT_COLORS } from '../core/constants.js'

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {import('../core/base-model.js').TableField|null} props.field
 * @param {import('../core/base-model.js').BaseTable} props.activeTable
 * @param {import('../core/base-model.js').BaseTable[]} props.tables
 * @param {(fieldData: any) => void} props.onSave
 * @param {() => void} props.onClose
 */
export function FieldModal({ isOpen, field, activeTable, tables, onSave, onClose }) {
  const isEditing = Boolean(field)
  const [name, setName] = useState(field?.name || 'New Field')
  const [type, setType] = useState(field?.type || FIELD_TYPES.TEXT)
  const [formula, setFormula] = useState(field?.formula || '')
  const [linkedTableId, setLinkedTableId] = useState(field?.linkedTableId || '')
  const [options, setOptions] = useState(
    field?.options?.length
      ? field.options
      : [
          { id: 'opt-1', label: 'Option 1', color: SELECT_COLORS[0] },
          { id: 'opt-2', label: 'Option 2', color: SELECT_COLORS[1] },
        ],
  )
  const [newOptionLabel, setNewOptionLabel] = useState('')

  if (!isOpen) return null

  const handleAddOption = () => {
    if (!newOptionLabel.trim()) return
    const nextColor = SELECT_COLORS[options.length % SELECT_COLORS.length]
    setOptions([
      ...options,
      { id: `opt-${Date.now()}`, label: newOptionLabel.trim(), color: nextColor },
    ])
    setNewOptionLabel('')
  }

  const handleRemoveOption = (id) => {
    setOptions(options.filter((o) => o.id !== id))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      name,
      type,
      options: type === FIELD_TYPES.SELECT || type === FIELD_TYPES.MULTISELECT ? options : [],
      formula: type === FIELD_TYPES.FORMULA ? formula : '',
      linkedTableId: type === FIELD_TYPES.LINK || type === FIELD_TYPES.LOOKUP ? linkedTableId : '',
    })
    onClose()
  }

  return (
    <div className="backdrop-blur-xs fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {isEditing ? 'Edit Field' : 'Add New Field'}
          </h3>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3.5">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Field Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Field Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            >
              <option value={FIELD_TYPES.TEXT}>Single line text</option>
              <option value={FIELD_TYPES.NUMBER}>Number</option>
              <option value={FIELD_TYPES.DATE}>Date</option>
              <option value={FIELD_TYPES.SELECT}>Single select</option>
              <option value={FIELD_TYPES.CHECKBOX}>Checkbox</option>
              <option value={FIELD_TYPES.FORMULA}>Formula (fx)</option>
              <option value={FIELD_TYPES.LINK}>Link to another table</option>
            </select>
          </div>

          {/* Select Options configuration */}
          {(type === FIELD_TYPES.SELECT || type === FIELD_TYPES.MULTISELECT) && (
            <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Options
              </label>
              <div className="flex max-h-36 flex-col gap-1.5 overflow-y-auto">
                {options.map((opt) => (
                  <div
                    key={opt.id}
                    className="flex items-center justify-between rounded bg-white px-2 py-1 text-xs dark:bg-slate-900"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: opt.color }}
                      />
                      <span className="text-slate-800 dark:text-slate-200">{opt.label}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(opt.id)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="New option label..."
                  value={newOptionLabel}
                  onChange={(e) => setNewOptionLabel(e.target.value)}
                  className="flex-1 rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900"
                />
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="flex items-center gap-1 rounded bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200"
                >
                  <Plus size={12} /> Add
                </button>
              </div>
            </div>
          )}

          {/* Formula input */}
          {type === FIELD_TYPES.FORMULA && (
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Formula Expression
              </label>
              <input
                type="text"
                placeholder="{Budget ($)} * 0.1"
                value={formula}
                onChange={(e) => setFormula(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 font-mono text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Reference columns using {'{Field Name}'}. Supports arithmetic (+, -, *, /) and text
                (&).
              </p>
            </div>
          )}

          {/* Link table configuration */}
          {type === FIELD_TYPES.LINK && (
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Link to Table
              </label>
              <select
                value={linkedTableId}
                onChange={(e) => setLinkedTableId(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              >
                <option value="">Select table...</option>
                {tables
                  .filter((t) => t.id !== activeTable.id)
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Save Field
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
