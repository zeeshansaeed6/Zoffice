/**
 * ZBase Grid View Component — spreadsheet-style interactive data grid.
 * @module GridView
 */

import React, { useState } from 'react'
import {
  Type,
  Hash,
  Calendar as CalendarIcon,
  CheckSquare,
  List,
  Calculator,
  Link as LinkIcon,
  Plus,
  Trash2,
  MoreVertical,
  Edit2,
} from 'lucide-react'
import { FIELD_TYPES } from '../core/constants.js'
import { evaluateFormula, resolveLookupValue } from '../core/formula-engine.js'

/**
 * Get Lucide icon for field type.
 * @param {string} type
 * @returns {React.ReactNode}
 */
function getFieldIcon(type) {
  switch (type) {
    case FIELD_TYPES.NUMBER:
      return <Hash size={14} className="text-blue-500" />
    case FIELD_TYPES.DATE:
      return <CalendarIcon size={14} className="text-amber-500" />
    case FIELD_TYPES.CHECKBOX:
      return <CheckSquare size={14} className="text-green-500" />
    case FIELD_TYPES.SELECT:
    case FIELD_TYPES.MULTISELECT:
      return <List size={14} className="text-purple-500" />
    case FIELD_TYPES.FORMULA:
    case FIELD_TYPES.ROLLUP:
      return <Calculator size={14} className="text-indigo-500" />
    case FIELD_TYPES.LINK:
    case FIELD_TYPES.LOOKUP:
      return <LinkIcon size={14} className="text-teal-500" />
    default:
      return <Type size={14} className="text-slate-500" />
  }
}

/**
 * @param {Object} props
 * @param {import('../core/base-model.js').BaseTable} props.table
 * @param {import('../core/base-model.js').BaseTable[]} props.tables
 * @param {string} props.searchQuery
 * @param {(tableId: string, recordId: string, fieldId: string, value: any) => void} props.onUpdateRecord
 * @param {(tableId: string, fields?: Record<string, any>) => void} props.onAddRecord
 * @param {(tableId: string, recordId: string) => void} props.onDeleteRecord
 * @param {(field?: any) => void} props.onOpenFieldModal
 * @param {(tableId: string, fieldId: string) => void} props.onDeleteField
 * @param {(record: any) => void} props.onOpenRecordModal
 */
export function GridView({
  table,
  tables,
  searchQuery,
  onUpdateRecord,
  onAddRecord,
  onDeleteRecord,
  onOpenFieldModal,
  onDeleteField,
  onOpenRecordModal,
}) {
  const [activeHeaderMenu, setActiveHeaderMenu] = useState(null)

  // Filter records by search query
  const filteredRecords = table.records.filter((rec) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return Object.values(rec.fields).some((val) => String(val).toLowerCase().includes(query))
  })

  /**
   * Render cell content based on field type.
   */
  const renderCellContent = (record, field) => {
    const rawVal = record.fields[field.id]

    // Formula calculation
    if (field.type === FIELD_TYPES.FORMULA) {
      const calc = evaluateFormula(field.formula, record, table.fields)
      return (
        <span className="flex items-center gap-1 font-mono text-xs text-indigo-600 dark:text-indigo-400">
          <span className="text-[10px] font-bold text-slate-400">fx</span>
          {String(calc)}
        </span>
      )
    }

    // Lookup calculation
    if (field.type === FIELD_TYPES.LOOKUP) {
      const linkField = table.fields.find((f) => f.type === FIELD_TYPES.LINK)
      const linkedTable = tables.find((t) => t.id === field.linkedTableId)
      const val = resolveLookupValue(record, field, linkField, linkedTable)
      return <span className="text-xs text-teal-600 dark:text-teal-400">{String(val)}</span>
    }

    // Checkbox field
    if (field.type === FIELD_TYPES.CHECKBOX) {
      return (
        <input
          type="checkbox"
          checked={Boolean(rawVal)}
          onChange={(e) => onUpdateRecord(table.id, record.id, field.id, e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
      )
    }

    // Select field
    if (field.type === FIELD_TYPES.SELECT && field.options?.length) {
      return (
        <select
          value={rawVal || ''}
          onChange={(e) => onUpdateRecord(table.id, record.id, field.id, e.target.value)}
          className="w-full bg-transparent text-xs text-slate-800 focus:outline-none dark:text-slate-200"
        >
          <option value="">(None)</option>
          {field.options.map((opt) => (
            <option key={opt.id} value={opt.label}>
              {opt.label}
            </option>
          ))}
        </select>
      )
    }

    // Default text/number input
    return (
      <input
        type={field.type === FIELD_TYPES.NUMBER ? 'number' : 'text'}
        value={rawVal ?? ''}
        onChange={(e) =>
          onUpdateRecord(
            table.id,
            record.id,
            field.id,
            field.type === FIELD_TYPES.NUMBER ? Number(e.target.value) : e.target.value,
          )
        }
        className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none dark:text-slate-200"
        placeholder="Empty"
      />
    )
  }

  return (
    <div className="flex h-full w-full flex-col overflow-auto bg-white dark:bg-slate-900">
      <table className="w-full border-collapse text-left text-xs">
        <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
          <tr>
            <th className="w-12 border-r border-slate-200 px-3 py-2 text-center text-slate-400 dark:border-slate-800">
              #
            </th>
            {table.fields.map((field) => (
              <th
                key={field.id}
                style={{ width: field.width || 180 }}
                className="relative border-r border-slate-200 px-3 py-2 text-slate-700 dark:border-slate-800 dark:text-slate-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-medium">
                    {getFieldIcon(field.type)}
                    <span>{field.name}</span>
                  </div>
                  <button
                    onClick={() =>
                      setActiveHeaderMenu(activeHeaderMenu === field.id ? null : field.id)
                    }
                    className="rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-800"
                  >
                    <MoreVertical size={13} />
                  </button>
                </div>

                {/* Column options menu */}
                {activeHeaderMenu === field.id && (
                  <div className="absolute right-2 top-8 z-20 w-36 rounded-md border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                    <button
                      onClick={() => {
                        setActiveHeaderMenu(null)
                        onOpenFieldModal(field)
                      }}
                      className="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <Edit2 size={12} /> Edit Field
                    </button>
                    {table.fields.length > 1 && (
                      <button
                        onClick={() => {
                          setActiveHeaderMenu(null)
                          onDeleteField(table.id, field.id)
                        }}
                        className="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <Trash2 size={12} /> Delete Field
                      </button>
                    )}
                  </div>
                )}
              </th>
            ))}
            <th className="w-24 px-3 py-2">
              <button
                onClick={() => onOpenFieldModal()}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                <Plus size={14} /> Add Field
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((record, index) => (
            <tr
              key={record.id}
              className="group border-b border-slate-100 hover:bg-slate-50/70 dark:border-slate-800/60 dark:hover:bg-slate-800/30"
            >
              <td className="border-slate-150 border-r px-2 py-1.5 text-center text-slate-400 dark:border-slate-800">
                <div className="flex items-center justify-center gap-1">
                  <span className="group-hover:hidden">{index + 1}</span>
                  <button
                    onClick={() => onDeleteRecord(table.id, record.id)}
                    className="hidden text-slate-400 hover:text-red-500 group-hover:block"
                    title="Delete record"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </td>
              {table.fields.map((field) => (
                <td
                  key={field.id}
                  className="border-slate-150 border-r px-3 py-1.5 dark:border-slate-800"
                >
                  {renderCellContent(record, field)}
                </td>
              ))}
              <td className="px-3 py-1.5 text-center">
                <button
                  onClick={() => onOpenRecordModal(record)}
                  className="text-xs text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Expand
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Record row button */}
      <div className="border-b border-slate-100 p-2 dark:border-slate-800">
        <button
          onClick={() => onAddRecord(table.id)}
          className="flex items-center gap-1.5 rounded px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <Plus size={14} /> Add Record
        </button>
      </div>
    </div>
  )
}
