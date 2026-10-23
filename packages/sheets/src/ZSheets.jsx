import React, { useState, useMemo, useCallback } from 'react'
import { Ribbon, StatusBar, StatusBarSlot, useTheme } from '@zoffice/ui'
import { getSheetsRibbonConfig } from './ribbon-config.jsx'
import { CanvasGrid } from './grid/CanvasGrid.jsx'
import { FormulaBar } from './formula-bar/FormulaBar.jsx'
import { SheetTabBar } from './components/SheetTabBar.jsx'
import {
  createWorkbook,
  createSheet,
  getCell,
  setCell,
  coordsToCellId,
} from './core/sheet-model.js'
import { FormulaEngine } from './core/formula-engine.js'

/**
 * ZSheets Spreadsheet Application Component.
 *
 * @param {Object} props
 * @param {string} props.id - Active document tab ID
 * @param {string} [props.title='Untitled Spreadsheet']
 * @param {(content?: string) => void} [props.onSave]
 */
export function ZSheets({ onSave }) {
  const { mode: themeMode } = useTheme()

  const [workbook, setWorkbook] = useState(() => createWorkbook('Sheet1'))
  const [activeCell, setActiveCell] = useState({ row: 0, col: 0 })
  const [selectedRange, setSelectedRange] = useState({
    startRow: 0,
    startCol: 0,
    endRow: 0,
    endCol: 0,
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const [zoom, setZoom] = useState(100)

  // Formula engine instance
  const formulaEngine = useMemo(() => {
    const engine = new FormulaEngine()
    engine.ensureSheet('sheet1', 'Sheet1')
    return engine
  }, [])

  // Get active sheet
  const activeSheet = useMemo(() => {
    return workbook.sheets.find((s) => s.id === workbook.activeSheetId) || workbook.sheets[0]
  }, [workbook])

  // Current active cell data
  const currentCell = useMemo(() => {
    return getCell(activeSheet, activeCell.row, activeCell.col)
  }, [activeSheet, activeCell])

  // Display formula bar value
  const formulaValue = isEditing ? editValue : currentCell?.raw || currentCell?.value || ''

  // Commit editing changes to sheet
  const handleCommitEdit = useCallback(() => {
    if (!isEditing) return
    formulaEngine.ensureSheet(activeSheet.id, activeSheet.name)
    formulaEngine.setCell(activeSheet.id, activeCell.row, activeCell.col, editValue)

    const computedVal = formulaEngine.getCellValue(activeSheet.id, activeCell.row, activeCell.col)

    setWorkbook((prev) => {
      const sheets = prev.sheets.map((s) => {
        if (s.id !== prev.activeSheetId) return s
        const updated = { ...s, data: { ...s.data } }
        setCell(updated, activeCell.row, activeCell.col, {
          raw: editValue,
          value: computedVal !== undefined ? computedVal : editValue,
        })
        return updated
      })
      return { ...prev, sheets }
    })
    setIsEditing(false)
  }, [isEditing, activeSheet, activeCell, editValue, formulaEngine])

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false)
    setEditValue('')
  }, [])

  const handleStartEdit = useCallback(() => {
    setIsEditing(true)
    setEditValue(currentCell?.raw || currentCell?.value || '')
  }, [currentCell])

  const handleSelectionChange = useCallback((cell, range) => {
    setActiveCell(cell)
    setSelectedRange(
      range || { startRow: cell.row, startCol: cell.col, endRow: cell.row, endCol: cell.col },
    )
  }, [])

  const handleColResize = useCallback((col, width) => {
    setWorkbook((prev) => {
      const sheets = prev.sheets.map((s) => {
        if (s.id !== prev.activeSheetId) return s
        return { ...s, colWidths: { ...s.colWidths, [col]: width } }
      })
      return { ...prev, sheets }
    })
  }, [])

  const handleRowResize = useCallback((row, height) => {
    setWorkbook((prev) => {
      const sheets = prev.sheets.map((s) => {
        if (s.id !== prev.activeSheetId) return s
        return { ...s, rowHeights: { ...s.rowHeights, [row]: height } }
      })
      return { ...prev, sheets }
    })
  }, [])

  const handleClearRange = useCallback(() => {
    setWorkbook((prev) => {
      const sheets = prev.sheets.map((s) => {
        if (s.id !== prev.activeSheetId) return s
        const updated = { ...s, data: { ...s.data } }
        for (let r = selectedRange.startRow; r <= selectedRange.endRow; r++) {
          for (let c = selectedRange.startCol; c <= selectedRange.endCol; c++) {
            setCell(updated, r, c, null)
          }
        }
        return updated
      })
      return { ...prev, sheets }
    })
  }, [selectedRange])

  // Sheet Tabs Management
  const handleAddSheet = useCallback(() => {
    setWorkbook((prev) => {
      const newIndex = prev.sheets.length + 1
      const newSheet = createSheet(`sheet_${Date.now()}`, `Sheet${newIndex}`)
      return {
        ...prev,
        activeSheetId: newSheet.id,
        sheets: [...prev.sheets, newSheet],
      }
    })
  }, [])

  const handleSelectSheet = useCallback((sheetId) => {
    setWorkbook((prev) => ({ ...prev, activeSheetId: sheetId }))
  }, [])

  const handleRenameSheet = useCallback((sheetId, newName) => {
    setWorkbook((prev) => ({
      ...prev,
      sheets: prev.sheets.map((s) => (s.id === sheetId ? { ...s, name: newName } : s)),
    }))
  }, [])

  // Range calculation summary for status bar (Count, Sum, Average)
  const selectionStats = useMemo(() => {
    let count = 0
    let numericCount = 0
    let sum = 0

    for (let r = selectedRange.startRow; r <= selectedRange.endRow; r++) {
      for (let c = selectedRange.startCol; c <= selectedRange.endCol; c++) {
        const cell = getCell(activeSheet, r, c)
        if (cell && (cell.value !== undefined || cell.raw !== undefined)) {
          count++
          const num = Number(cell.value ?? cell.raw)
          if (!isNaN(num) && String(cell.value ?? cell.raw).trim() !== '') {
            numericCount++
            sum += num
          }
        }
      }
    }

    if (numericCount === 0) {
      return count > 0 ? `Count: ${count}` : 'Ready'
    }
    const avg = (sum / numericCount).toFixed(2).replace(/\.00$/, '')
    return `Count: ${count} | Sum: ${sum} | Average: ${avg}`
  }, [activeSheet, selectedRange])

  const ribbonConfig = getSheetsRibbonConfig({
    onSave,
    canSave: true,
  })

  return (
    <div
      data-testid="zsheets-app"
      className="flex h-full w-full select-none flex-col bg-white dark:bg-neutral-950"
    >
      <Ribbon config={ribbonConfig} />

      {/* Formula Bar */}
      <FormulaBar
        activeCell={activeCell}
        value={formulaValue}
        onChange={(val) => {
          if (!isEditing) setIsEditing(true)
          setEditValue(val)
        }}
        onCommit={handleCommitEdit}
        onCancel={handleCancelEdit}
        onFxClick={handleStartEdit}
      />

      {/* High-Performance Canvas Virtual Grid */}
      <CanvasGrid
        sheet={activeSheet}
        activeCell={activeCell}
        selectedRange={selectedRange}
        themeMode={themeMode}
        onSelectionChange={handleSelectionChange}
        onColResize={handleColResize}
        onRowResize={handleRowResize}
        isEditing={isEditing}
        editValue={editValue}
        onEditValueChange={setEditValue}
        onStartEdit={handleStartEdit}
        onCommitEdit={handleCommitEdit}
        onCancelEdit={handleCancelEdit}
        onClearRange={handleClearRange}
      />

      {/* Multi-Sheet Bottom Tabs */}
      <SheetTabBar
        sheets={workbook.sheets}
        activeSheetId={workbook.activeSheetId}
        onSelectSheet={handleSelectSheet}
        onAddSheet={handleAddSheet}
        onRenameSheet={handleRenameSheet}
      />

      {/* Status Bar */}
      <StatusBar
        leftContent={
          <>
            <StatusBarSlot>{coordsToCellId(activeCell.row, activeCell.col)}</StatusBarSlot>
            <StatusBarSlot>{activeSheet.name}</StatusBarSlot>
            <StatusBarSlot>Ready</StatusBarSlot>
          </>
        }
        centerContent={selectionStats}
        zoom={zoom}
        onZoomChange={setZoom}
      />
    </div>
  )
}
