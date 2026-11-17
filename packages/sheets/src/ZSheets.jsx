import React, { useState, useMemo, useCallback } from 'react'
import { Ribbon, StatusBar, StatusBarSlot, useTheme, AiAssistantSidebar } from '@zoffice/ui'
import { saveFileAs } from '@zoffice/core'
import { getSheetsRibbonConfig } from './ribbon/ribbon-config.jsx'
import { CanvasGrid } from './grid/CanvasGrid.jsx'
import { FormulaBar } from './formula-bar/FormulaBar.jsx'
import { SheetTabBar } from './components/SheetTabBar.jsx'
import { getCell, setCell, coordsToCellId } from './core/sheet-model.js'
import { useSheetTabs } from './core/use-sheet-tabs.js'
import { useWorkbook } from './core/use-workbook.js'
import { DEFAULT_DECIMALS } from './core/number-format.js'
import { summarizeSelection } from './core/selection-stats.js'
import { sheetToCsv } from './core/csv-io.js'
import { changeStructure } from './core/structure-ops.js'
import {
  updateActiveSheet,
  applyStyle,
  applyNumberFormat,
  clearContents,
  autoAggregate,
  sortRange,
  usedRange,
} from './core/sheet-ops.js'

const noRecalc = { recalc: false, history: false }

/**
 * ZSheets Spreadsheet Application Component.
 *
 * @param {Object} props
 * @param {string} props.id - Active document tab ID
 * @param {string} [props.title='Untitled Spreadsheet']
 * @param {string} [props.initialContent] - Workbook JSON, base64 .xlsx, or CSV text
 * @param {(content: string) => void} [props.onChange]
 * @param {(content?: string) => void} [props.onSave]
 */
export function ZSheets({ title = 'Untitled Spreadsheet', onSave, onChange, initialContent }) {
  const { mode: themeMode } = useTheme()
  const { workbook, update, undo, redo, canUndo, canRedo, exportXlsx } = useWorkbook({
    initialContent,
    onChange,
  })

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
  const [showAiSidebar, setShowAiSidebar] = useState(false)

  const activeSheet = useMemo(
    () => workbook.sheets.find((s) => s.id === workbook.activeSheetId) || workbook.sheets[0],
    [workbook],
  )
  const currentCell = getCell(activeSheet, activeCell.row, activeCell.col)
  const formulaValue = isEditing ? editValue : currentCell?.raw || currentCell?.value || ''

  const withSheet = useCallback((fn) => update((wb) => updateActiveSheet(wb, fn)), [update])

  const handleCommitEdit = useCallback(
    (override) => {
      // A string override (e.g. an AI-inserted formula) commits even when not editing
      const hasOverride = typeof override === 'string'
      if (!isEditing && !hasOverride) return
      const text = hasOverride ? override : editValue
      const { row, col } = activeCell
      withSheet((s) => {
        if (text === '')
          clearContents(s, { startRow: row, startCol: col, endRow: row, endCol: col })
        else setCell(s, row, col, { raw: text, value: text })
      })
      setIsEditing(false)
    },
    [isEditing, editValue, activeCell, withSheet],
  )

  const handleAiInsert = useCallback(
    (result) => {
      if (result) handleCommitEdit(result.formula || result.content || '')
    },
    [handleCommitEdit],
  )

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

  const resize = useCallback(
    (key, index, size) =>
      update(
        (wb) => ({
          ...wb,
          sheets: wb.sheets.map((s) =>
            s.id === wb.activeSheetId ? { ...s, [key]: { ...s[key], [index]: size } } : s,
          ),
        }),
        noRecalc,
      ),
    [update],
  )

  const handleClearRange = useCallback(
    () => withSheet((s) => clearContents(s, selectedRange)),
    [withSheet, selectedRange],
  )

  const handleSort = useCallback(
    (ascending) => {
      const single =
        selectedRange.startRow === selectedRange.endRow &&
        selectedRange.startCol === selectedRange.endCol
      const range = single ? usedRange(activeSheet) : selectedRange
      if (range) withSheet((s) => sortRange(s, range, activeCell.col, ascending))
    },
    [withSheet, selectedRange, activeSheet, activeCell.col],
  )

  const handleChangeDecimals = useCallback(
    (delta) => {
      const fmt = currentCell?.numFmt
      const typed = fmt && fmt !== 'general'
      const fraction = String(currentCell?.value ?? '').split('.')[1]?.length ?? 0
      const current = currentCell?.decimals ?? (typed ? DEFAULT_DECIMALS[fmt] : fraction)
      const next = Math.min(10, Math.max(0, current + delta))
      withSheet((s) => applyNumberFormat(s, selectedRange, typed ? fmt : 'number', next))
    },
    [withSheet, currentCell, selectedRange],
  )

  const handleStructure = useCallback(
    (axis, action) => {
      const isRow = axis === 'row'
      const index = isRow ? selectedRange.startRow : selectedRange.startCol
      const count = isRow
        ? selectedRange.endRow - selectedRange.startRow + 1
        : selectedRange.endCol - selectedRange.startCol + 1
      update((wb) => changeStructure(wb, axis, action, index, count))
    },
    [update, selectedRange],
  )

  const handleSave = useCallback(async () => {
    if (onSave) onSave(await exportXlsx())
  }, [onSave, exportXlsx])

  const tabs = useSheetTabs(update)

  const selectionStats = useMemo(
    () => summarizeSelection(activeSheet, selectedRange),
    [activeSheet, selectedRange],
  )

  const style = currentCell?.style || {}
  const ribbonConfig = getSheetsRibbonConfig({
    onSave: handleSave,
    canSave: true,
    onUndo: undo,
    onRedo: redo,
    canUndo,
    canRedo,
    onToggleAi: () => setShowAiSidebar((p) => !p),
    activeStyle: style,
    onToggleBold: () => withSheet((s) => applyStyle(s, selectedRange, { bold: !style.bold })),
    onToggleItalic: () => withSheet((s) => applyStyle(s, selectedRange, { italic: !style.italic })),
    onSetAlign: (align) => withSheet((s) => applyStyle(s, selectedRange, { align })),
    onSetFill: (bgColor) => withSheet((s) => applyStyle(s, selectedRange, { bgColor })),
    onSetTextColor: (textColor) => withSheet((s) => applyStyle(s, selectedRange, { textColor })),
    onSetNumberFormat: (fmt) => withSheet((s) => applyNumberFormat(s, selectedRange, fmt)),
    onChangeDecimals: handleChangeDecimals,
    onClearContents: handleClearRange,
    onStructure: handleStructure,
    onDeleteSheet: tabs.deleteSheet,
    onAutoSum: (fn) => withSheet((s) => autoAggregate(s, selectedRange, fn)),
    onSort: handleSort,
    onExportCsv: () => saveFileAs(title, sheetToCsv(activeSheet), 'csv'),
    showGridlines: !activeSheet.hideGridlines,
    onToggleGridlines: () =>
      update((wb) => updateActiveSheet(wb, (s) => (s.hideGridlines = !s.hideGridlines)), noRecalc),
  })

  return (
    <div
      data-testid="zsheets-app"
      className="flex h-full w-full select-none flex-col bg-white dark:bg-neutral-950"
    >
      <Ribbon config={ribbonConfig} />

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

      <div className="flex flex-1 overflow-hidden">
        <CanvasGrid
          sheet={activeSheet}
          activeCell={activeCell}
          selectedRange={selectedRange}
          themeMode={themeMode}
          onSelectionChange={handleSelectionChange}
          onColResize={(col, width) => resize('colWidths', col, width)}
          onRowResize={(row, height) => resize('rowHeights', row, height)}
          isEditing={isEditing}
          editValue={editValue}
          onEditValueChange={setEditValue}
          onStartEdit={handleStartEdit}
          onCommitEdit={handleCommitEdit}
          onCancelEdit={handleCancelEdit}
          onClearRange={handleClearRange}
        />
        <AiAssistantSidebar
          isOpen={showAiSidebar}
          onClose={() => setShowAiSidebar(false)}
          appId="sheets"
          onInsert={handleAiInsert}
        />
      </div>

      <SheetTabBar
        sheets={workbook.sheets}
        activeSheetId={workbook.activeSheetId}
        onSelectSheet={tabs.selectSheet}
        onAddSheet={tabs.addSheet}
        onRenameSheet={tabs.renameSheet}
      />

      <StatusBar
        leftContent={
          <>
            <StatusBarSlot>{coordsToCellId(activeCell.row, activeCell.col)}</StatusBarSlot>
            <StatusBarSlot>{activeSheet.name}</StatusBarSlot>
            <StatusBarSlot>Ready</StatusBarSlot>
            <StatusBarSlot>
              <button
                type="button"
                onClick={() => setShowAiSidebar((p) => !p)}
                className="font-medium hover:text-purple-600 dark:hover:text-purple-400"
              >
                AI Assistant
              </button>
            </StatusBarSlot>
          </>
        }
        centerContent={selectionStats}
        zoom={zoom}
        onZoomChange={setZoom}
      />
    </div>
  )
}
