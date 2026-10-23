import { describe, it, expect } from 'vitest'
import {
  colIndexToLabel,
  labelToColIndex,
  cellIdToCoords,
  coordsToCellId,
  parseRange,
  formatRange,
  createSheet,
  createWorkbook,
  setCell,
  getCell,
  getColWidth,
  getRowHeight,
} from '../core/sheet-model.js'
import {
  getVisibleRange,
  getCellRect,
  getRangeRect,
  getCellAtPoint,
} from '../grid/grid-viewport.js'
import {
  normalizeRange,
  isCellInRange,
  isCellActive,
  getFillHandleRect,
  isPointInFillHandle,
} from '../grid/grid-selection.js'
import { handleKeyDown } from '../grid/grid-keyboard.js'

describe('ZSheets Sheet Model & Coordinates', () => {
  it('converts column indices to letter labels and back', () => {
    expect(colIndexToLabel(0)).toBe('A')
    expect(colIndexToLabel(25)).toBe('Z')
    expect(colIndexToLabel(26)).toBe('AA')
    expect(colIndexToLabel(27)).toBe('AB')
    expect(colIndexToLabel(51)).toBe('AZ')
    expect(colIndexToLabel(52)).toBe('BA')
    expect(colIndexToLabel(701)).toBe('ZZ')
    expect(colIndexToLabel(702)).toBe('AAA')

    expect(labelToColIndex('A')).toBe(0)
    expect(labelToColIndex('Z')).toBe(25)
    expect(labelToColIndex('AA')).toBe(26)
    expect(labelToColIndex('AB')).toBe(27)
    expect(labelToColIndex('AZ')).toBe(51)
    expect(labelToColIndex('BA')).toBe(52)
    expect(labelToColIndex('ZZ')).toBe(701)
    expect(labelToColIndex('AAA')).toBe(702)
  })

  it('converts cell IDs to coordinates and back', () => {
    expect(cellIdToCoords('A1')).toEqual({ row: 0, col: 0, sheet: undefined })
    expect(cellIdToCoords('B12')).toEqual({ row: 11, col: 1, sheet: undefined })
    expect(cellIdToCoords('Sheet2!C5')).toEqual({ row: 4, col: 2, sheet: 'Sheet2' })
    expect(coordsToCellId(0, 0)).toBe('A1')
    expect(coordsToCellId(11, 1)).toBe('B12')
    expect(coordsToCellId(99, 25)).toBe('Z100')
  })

  it('parses and formats range expressions', () => {
    expect(parseRange('A1:B10')).toEqual({ startRow: 0, startCol: 0, endRow: 9, endCol: 1 })
    expect(parseRange('$C$5:$D$8')).toEqual({ startRow: 4, startCol: 2, endRow: 7, endCol: 3 })
    expect(parseRange('B3')).toEqual({ startRow: 2, startCol: 1, endRow: 2, endCol: 1 })
    expect(formatRange({ startRow: 0, startCol: 0, endRow: 9, endCol: 1 })).toBe('A1:B10')
    expect(formatRange({ startRow: 2, startCol: 1, endRow: 2, endCol: 1 })).toBe('B3')
  })

  it('creates workbook and handles cell operations with custom dimensions', () => {
    const wb = createWorkbook('Q1 Budget')
    expect(wb.sheets).toHaveLength(1)
    expect(wb.sheets[0].name).toBe('Q1 Budget')

    const sheet = wb.sheets[0]
    setCell(sheet, 0, 0, 'Revenue')
    setCell(sheet, 0, 1, 15000)

    expect(getCell(sheet, 0, 0)).toEqual({ raw: 'Revenue', value: 'Revenue' })
    expect(getCell(sheet, 0, 1)).toEqual({ raw: '15000', value: 15000 })
    expect(getCell(sheet, 1, 0)).toBeNull()

    // Test clearing cell
    setCell(sheet, 0, 1, null)
    expect(getCell(sheet, 0, 1)).toBeNull()

    // Dimensions
    expect(getColWidth(sheet, 0)).toBe(100)
    sheet.colWidths[0] = 160
    expect(getColWidth(sheet, 0)).toBe(160)

    expect(getRowHeight(sheet, 0)).toBe(24)
    sheet.rowHeights[0] = 32
    expect(getRowHeight(sheet, 0)).toBe(32)
  })
})

describe('ZSheets Grid Viewport & Hit Testing', () => {
  const sheet = createSheet('s1', 'Sheet1')

  it('computes visible row and column ranges based on scroll position', () => {
    const visible = getVisibleRange({
      scrollX: 250,
      scrollY: 100,
      width: 800,
      height: 600,
      sheet,
    })

    expect(visible.startCol).toBeGreaterThan(0)
    expect(visible.endCol).toBeGreaterThan(visible.startCol)
    expect(visible.startRow).toBeGreaterThan(0)
    expect(visible.endRow).toBeGreaterThan(visible.startRow)
  })

  it('calculates cell pixel bounding rectangles', () => {
    const rect = getCellRect({ row: 0, col: 0, scrollX: 0, scrollY: 0, sheet })
    expect(rect.x).toBe(50) // ROW_HEADER_WIDTH
    expect(rect.y).toBe(26) // COL_HEADER_HEIGHT
    expect(rect.width).toBe(100)
    expect(rect.height).toBe(24)

    const rangeRect = getRangeRect({
      range: { startRow: 0, startCol: 0, endRow: 1, endCol: 1 },
      scrollX: 0,
      scrollY: 0,
      sheet,
    })
    expect(rangeRect.x).toBe(50)
    expect(rangeRect.y).toBe(26)
    expect(rangeRect.width).toBe(200)
    expect(rangeRect.height).toBe(48)
  })

  it('maps mouse points to cell and header hit targets', () => {
    const cellHit = getCellAtPoint({ x: 80, y: 40, scrollX: 0, scrollY: 0, sheet })
    expect(cellHit.row).toBe(0)
    expect(cellHit.col).toBe(0)
    expect(cellHit.isColHeader).toBe(false)
    expect(cellHit.isRowHeader).toBe(false)

    const colHeaderHit = getCellAtPoint({ x: 80, y: 10, scrollX: 0, scrollY: 0, sheet })
    expect(colHeaderHit.isColHeader).toBe(true)
    expect(colHeaderHit.col).toBe(0)

    const rowHeaderHit = getCellAtPoint({ x: 20, y: 40, scrollX: 0, scrollY: 0, sheet })
    expect(rowHeaderHit.isRowHeader).toBe(true)
    expect(rowHeaderHit.row).toBe(0)

    const cornerHit = getCellAtPoint({ x: 10, y: 10, scrollX: 0, scrollY: 0, sheet })
    expect(cornerHit.isCorner).toBe(true)
  })
})

describe('ZSheets Selection Geometry & Keyboard Navigation', () => {
  it('normalizes selections and calculates fill handle bounding box', () => {
    const range = normalizeRange(5, 4, 1, 2)
    expect(range).toEqual({ startRow: 1, startCol: 2, endRow: 5, endCol: 4 })

    expect(isCellInRange(2, 3, range)).toBe(true)
    expect(isCellInRange(0, 0, range)).toBe(false)
    expect(isCellActive(1, 2, { row: 1, col: 2 })).toBe(true)
    expect(isCellActive(2, 2, { row: 1, col: 2 })).toBe(false)

    const rangeRect = { x: 50, y: 26, width: 200, height: 100 }
    const handle = getFillHandleRect(rangeRect)
    expect(isPointInFillHandle(handle.x + 2, handle.y + 2, rangeRect)).toBe(true)
    expect(isPointInFillHandle(0, 0, rangeRect)).toBe(false)
  })

  it('processes Excel keyboard navigation', () => {
    const activeCell = { row: 5, col: 5 }
    const selectedRange = { startRow: 5, startCol: 5, endRow: 5, endCol: 5 }

    const up = handleKeyDown(
      { key: 'ArrowUp', preventDefault: () => {} },
      { activeCell, selectedRange },
    )
    expect(up?.activeCell).toEqual({ row: 4, col: 5 })

    const right = handleKeyDown(
      { key: 'ArrowRight', preventDefault: () => {} },
      { activeCell, selectedRange },
    )
    expect(right?.activeCell).toEqual({ row: 5, col: 6 })

    const tab = handleKeyDown(
      { key: 'Tab', preventDefault: () => {} },
      { activeCell, selectedRange },
    )
    expect(tab?.activeCell).toEqual({ row: 5, col: 6 })

    const enter = handleKeyDown(
      { key: 'Enter', preventDefault: () => {} },
      { activeCell, selectedRange },
    )
    expect(enter?.activeCell).toEqual({ row: 6, col: 5 })

    const f2 = handleKeyDown({ key: 'F2', preventDefault: () => {} }, { activeCell, selectedRange })
    expect(f2?.type).toBe('start_edit')

    const del = handleKeyDown(
      { key: 'Delete', preventDefault: () => {} },
      { activeCell, selectedRange },
    )
    expect(del?.type).toBe('clear_range')

    const typeChar = handleKeyDown(
      { key: 'X', length: 1, preventDefault: () => {} },
      { activeCell, selectedRange },
    )
    expect(typeChar?.type).toBe('start_edit_with_char')
    expect(typeChar?.char).toBe('X')
  })
})
