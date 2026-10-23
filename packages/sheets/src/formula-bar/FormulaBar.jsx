import React, { useRef } from 'react'
import { coordsToCellId } from '../core/sheet-model.js'

/**
 * Formula bar displaying the active cell reference, fx button, and formula/text editor.
 *
 * @param {Object} props
 * @param {{ row: number, col: number } | null} props.activeCell
 * @param {string} props.value
 * @param {(value: string) => void} props.onChange
 * @param {() => void} [props.onCommit]
 * @param {() => void} [props.onCancel]
 * @param {() => void} [props.onFxClick]
 */
export function FormulaBar({ activeCell, value, onChange, onCommit, onCancel, onFxClick }) {
  const inputRef = useRef(null)
  const cellRefStr = activeCell ? coordsToCellId(activeCell.row, activeCell.col) : 'A1'

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onCommit?.()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onCancel?.()
    }
  }

  return (
    <div
      data-testid="formula-bar"
      className="flex h-8 select-none items-center gap-1.5 border-b border-neutral-200 bg-white px-2 text-xs dark:border-neutral-800 dark:bg-neutral-900"
    >
      {/* Name Box (Cell Address) */}
      <div className="flex h-6 w-16 items-center justify-center rounded border border-neutral-200 bg-neutral-50 font-mono font-medium text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
        {cellRefStr}
      </div>

      <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-700" />

      {/* Function fx button */}
      <button
        type="button"
        title="Insert Function"
        onClick={onFxClick}
        className="flex h-6 w-6 items-center justify-center rounded font-serif text-sm font-semibold italic text-neutral-500 hover:bg-neutral-100 hover:text-blue-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-blue-400"
      >
        fx
      </button>

      <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-700" />

      {/* Formula Editor Input */}
      <input
        ref={inputRef}
        type="text"
        aria-label="Formula Bar Input"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter formula (e.g. =SUM(A1:A10)) or value"
        className="h-6 flex-1 bg-transparent px-1.5 font-mono text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-neutral-100 dark:placeholder:text-neutral-500"
      />
    </div>
  )
}
