import React, { useState } from 'react'
import { Ribbon, StatusBar, StatusBarSlot } from '@zoffice/ui'
import { getSheetsRibbonConfig } from './ribbon-config.js'

const COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
const ROWS = Array.from({ length: 25 }, (_, i) => i + 1)

/**
 * ZSheets Spreadsheet Application Component.
 *
 * @param {Object} props
 * @param {string} props.id
 * @param {string} [props.title='Untitled Spreadsheet']
 * @param {() => void} [props.onSave]
 */
export function ZSheets({ onSave }) {
  const [selectedCell, setSelectedCell] = useState('A1')
  const [cellValues, setCellValues] = useState(/** @type {Record<string, string>} */ ({}))
  const [zoom, setZoom] = useState(100)
  const [bold, setBold] = useState(false)
  const [italic, setItalic] = useState(false)
  const [align, setAlign] = useState('left')

  const handleCellChange = (cellId, value) => {
    setCellValues((prev) => ({ ...prev, [cellId]: value }))
  }

  const ribbonConfig = getSheetsRibbonConfig({
    bold,
    italic,
    align,
    toggleBold: () => setBold(!bold),
    toggleItalic: () => setItalic(!italic),
    setAlign,
    onSave,
    canSave: true,
  })

  return (
    <div
      data-testid="zsheets-app"
      className="flex h-full w-full flex-col bg-white dark:bg-neutral-950"
    >
      <Ribbon config={ribbonConfig} />

      {/* Formula Bar */}
      <div className="flex items-center gap-2 border-b border-neutral-200 bg-neutral-50 px-3 py-1 text-xs dark:border-neutral-800 dark:bg-neutral-900">
        <span className="w-12 font-mono font-semibold text-neutral-600 dark:text-neutral-400">
          {selectedCell}
        </span>
        <div className="h-4 w-px bg-neutral-300 dark:bg-neutral-700" />
        <span className="font-serif italic text-neutral-400">fx</span>
        <input
          type="text"
          aria-label="Formula bar"
          value={cellValues[selectedCell] || ''}
          onChange={(e) => handleCellChange(selectedCell, e.target.value)}
          placeholder="Enter formula or value"
          className="flex-1 bg-transparent px-1 font-mono text-neutral-800 outline-none dark:text-neutral-200"
        />
      </div>

      {/* Spreadsheet Grid */}
      <div className="flex-1 overflow-auto">
        <div
          className="inline-block min-w-full origin-top-left transition-transform"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          <table className="border-collapse text-xs">
            <thead>
              <tr>
                <th className="h-6 w-10 border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900" />
                {COLS.map((col) => (
                  <th
                    key={col}
                    className="h-6 w-24 border border-neutral-200 bg-neutral-100 font-medium text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row}>
                  <td className="h-6 border border-neutral-200 bg-neutral-100 text-center font-medium text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                    {row}
                  </td>
                  {COLS.map((col) => {
                    const cellId = `${col}${row}`
                    const isSelected = selectedCell === cellId
                    return (
                      <td
                        key={cellId}
                        onClick={() => setSelectedCell(cellId)}
                        className={`h-6 border border-neutral-200 p-0 dark:border-neutral-800 ${
                          isSelected ? 'z-10 outline outline-2 outline-blue-600' : ''
                        }`}
                      >
                        <input
                          type="text"
                          aria-label={`Cell ${cellId}`}
                          value={cellValues[cellId] || ''}
                          onChange={(e) => handleCellChange(cellId, e.target.value)}
                          onFocus={() => setSelectedCell(cellId)}
                          className={`h-full w-full bg-transparent px-1.5 text-neutral-800 outline-none dark:text-neutral-200 ${
                            bold ? 'font-bold' : ''
                          } ${italic ? 'italic' : ''} text-${align}`}
                        />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar
        leftContent={
          <>
            <StatusBarSlot>Sheet1</StatusBarSlot>
            <StatusBarSlot>Ready</StatusBarSlot>
          </>
        }
        centerContent="Count: 0 | Sum: 0"
        zoom={zoom}
        onZoomChange={setZoom}
      />
    </div>
  )
}
