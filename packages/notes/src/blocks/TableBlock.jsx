/**
 * ZNotes table block — editable grid table.
 */

import React, { useMemo, useCallback } from 'react'
import { Plus, Minus } from 'lucide-react'

/**
 * Editable table block.
 * @param {Object} props
 * @param {import('../core/notebook-model.js').Block} props.block
 * @param {boolean} props.isActive
 * @param {(updates: Object) => void} props.onUpdate
 */
export function TableBlock({ block, isActive, onUpdate }) {
  const rows = useMemo(() => {
    try {
      const data = JSON.parse(block.content)
      return Array.isArray(data.rows) ? data.rows : [['', ''], ['', '']]
    } catch {
      return [['', ''], ['', '']]
    }
  }, [block.content])

  const updateRows = useCallback((newRows) => {
    onUpdate({ content: JSON.stringify({ rows: newRows }) })
  }, [onUpdate])

  const updateCell = useCallback((rowIdx, colIdx, value) => {
    const next = rows.map((row, ri) =>
      ri === rowIdx
        ? row.map((cell, ci) => (ci === colIdx ? value : cell))
        : row,
    )
    updateRows(next)
  }, [rows, updateRows])

  const addRow = useCallback(() => {
    const cols = rows[0]?.length || 2
    updateRows([...rows, Array(cols).fill('')])
  }, [rows, updateRows])

  const addCol = useCallback(() => {
    updateRows(rows.map((row) => [...row, '']))
  }, [rows, updateRows])

  const removeRow = useCallback((idx) => {
    if (rows.length <= 1) return
    updateRows(rows.filter((_, i) => i !== idx))
  }, [rows, updateRows])

  const removeCol = useCallback((idx) => {
    if ((rows[0]?.length || 0) <= 1) return
    updateRows(rows.map((row) => row.filter((_, i) => i !== idx)))
  }, [rows, updateRows])

  return (
    <div className="overflow-auto px-1 py-1" data-testid="table-block">
      <table className="w-full border-collapse text-xs">
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="border border-neutral-200 dark:border-neutral-700"
                >
                  <input
                    type="text"
                    value={cell}
                    onChange={(e) => updateCell(ri, ci, e.target.value)}
                    readOnly={!isActive}
                    className={`w-full bg-transparent px-2 py-1 text-xs outline-none ${
                      ri === 0
                        ? 'font-semibold text-neutral-700 dark:text-neutral-300'
                        : 'text-neutral-600 dark:text-neutral-400'
                    }`}
                  />
                </td>
              ))}
              {isActive && (
                <td className="w-5 border-none">
                  <button
                    type="button"
                    onClick={() => removeRow(ri)}
                    className="p-0.5 text-neutral-300 hover:text-red-500"
                    title="Remove row"
                  >
                    <Minus size={10} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {isActive && (
        <div className="mt-1 flex gap-2">
          <button
            type="button"
            onClick={addRow}
            className="flex items-center gap-0.5 text-[10px] text-neutral-400 hover:text-violet-600"
          >
            <Plus size={10} /> Row
          </button>
          <button
            type="button"
            onClick={addCol}
            className="flex items-center gap-0.5 text-[10px] text-neutral-400 hover:text-violet-600"
          >
            <Plus size={10} /> Column
          </button>
        </div>
      )}
    </div>
  )
}
