import React, { useState } from 'react'
import { Dialog } from '@zoffice/ui'

/**
 * Dialog for selecting table rows and columns.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {(rows: number, cols: number, withHeader: boolean) => void} props.onInsert
 */
export function TablePickerDialog({ isOpen, onClose, onInsert }) {
  const [hoveredRow, setHoveredRow] = useState(3)
  const [hoveredCol, setHoveredCol] = useState(3)
  const [customRows, setCustomRows] = useState(3)
  const [customCols, setCustomCols] = useState(3)
  const [withHeader, setWithHeader] = useState(true)

  const maxRows = 8
  const maxCols = 8

  const handleCellClick = (r, c) => {
    onInsert(r, c, withHeader)
    onClose()
  }

  const handleCustomSubmit = (e) => {
    e.preventDefault()
    onInsert(
      Math.max(1, Math.min(50, customRows)),
      Math.max(1, Math.min(20, customCols)),
      withHeader,
    )
    onClose()
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Insert Table"
      size="sm"
      footer={
        <div className="flex w-full items-center justify-between">
          <label className="flex cursor-pointer items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
            <input
              type="checkbox"
              checked={withHeader}
              onChange={(e) => setWithHeader(e.target.checked)}
              className="rounded border-neutral-300 text-blue-600"
            />
            Include header row
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCustomSubmit}
              className="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
            >
              Insert
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Interactive Grid Selector */}
        <div>
          <div className="mb-2 text-xs font-medium text-neutral-700 dark:text-neutral-300">
            Select dimensions: {hoveredRow} × {hoveredCol} Table
          </div>
          <div
            className="inline-grid gap-1 rounded-md border border-neutral-200 bg-neutral-50 p-2 dark:border-neutral-700 dark:bg-neutral-900"
            style={{
              gridTemplateColumns: `repeat(${maxCols}, minmax(0, 1fr))`,
            }}
            onMouseLeave={() => {
              setHoveredRow(customRows)
              setHoveredCol(customCols)
            }}
          >
            {Array.from({ length: maxRows }).map((_, r) =>
              Array.from({ length: maxCols }).map((__, c) => {
                const rowNum = r + 1
                const colNum = c + 1
                const isHighlighted = rowNum <= hoveredRow && colNum <= hoveredCol
                return (
                  <button
                    key={`${rowNum}-${colNum}`}
                    type="button"
                    onMouseEnter={() => {
                      setHoveredRow(rowNum)
                      setHoveredCol(colNum)
                      setCustomRows(rowNum)
                      setCustomCols(colNum)
                    }}
                    onClick={() => handleCellClick(rowNum, colNum)}
                    className={`rounded-xs h-5 w-5 border transition-colors ${
                      isHighlighted
                        ? 'border-blue-500 bg-blue-100 dark:border-blue-400 dark:bg-blue-900/60'
                        : 'border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-800'
                    }`}
                    title={`${rowNum} × ${colNum}`}
                  />
                )
              }),
            )}
          </div>
        </div>

        {/* Custom Rows & Columns input */}
        <div className="grid grid-cols-2 gap-3 border-t border-neutral-200 pt-2 dark:border-neutral-800">
          <div>
            <label
              htmlFor="table-rows-input"
              className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-400"
            >
              Number of rows
            </label>
            <input
              id="table-rows-input"
              type="number"
              min="1"
              max="50"
              value={customRows}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10) || 1
                setCustomRows(val)
                setHoveredRow(Math.min(maxRows, val))
              }}
              className="w-full rounded border border-neutral-300 px-2 py-1 text-xs outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            />
          </div>
          <div>
            <label
              htmlFor="table-cols-input"
              className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-400"
            >
              Number of columns
            </label>
            <input
              id="table-cols-input"
              type="number"
              min="1"
              max="20"
              value={customCols}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10) || 1
                setCustomCols(val)
                setHoveredCol(Math.min(maxCols, val))
              }}
              className="w-full rounded border border-neutral-300 px-2 py-1 text-xs outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            />
          </div>
        </div>
      </div>
    </Dialog>
  )
}
