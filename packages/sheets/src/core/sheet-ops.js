import { getCell, setCell, coordsToCellId } from './sheet-model.js'

/**
 * Pure cell operations. Each takes a workbook and returns a new one with the
 * active sheet changed; callers recalculate afterwards.
 * @typedef {{ startRow: number, startCol: number, endRow: number, endCol: number }} Range
 */

/** Copies a sheet deeply enough that cell edits never touch the original. */
export function cloneSheet(sheet) {
  const data = {}
  for (const [r, cols] of Object.entries(sheet.data || {})) {
    data[r] = {}
    for (const [c, cell] of Object.entries(cols)) data[r][c] = { ...cell }
  }
  return { ...sheet, data, colWidths: { ...sheet.colWidths }, rowHeights: { ...sheet.rowHeights } }
}

/**
 * Applies fn to a clone of the active sheet.
 * @param {Object} workbook
 * @param {(sheet: Object) => void} fn
 */
export function updateActiveSheet(workbook, fn) {
  return {
    ...workbook,
    sheets: workbook.sheets.map((s) => {
      if (s.id !== workbook.activeSheetId) return s
      const copy = cloneSheet(s)
      fn(copy)
      return copy
    }),
  }
}

function eachCell(range, fn) {
  for (let r = range.startRow; r <= range.endRow; r++) {
    for (let c = range.startCol; c <= range.endCol; c++) fn(r, c)
  }
}

/** Merges a style patch (bold, italic, align, bgColor, textColor...) into every cell of the range. */
export function applyStyle(sheet, range, patch) {
  eachCell(range, (r, c) => {
    const existing = getCell(sheet, r, c)
    setCell(sheet, r, c, { style: { ...existing?.style, ...patch } })
  })
}

/** Sets the number format (and optional decimals) of every cell in the range. */
export function applyNumberFormat(sheet, range, numFmt, decimals) {
  eachCell(range, (r, c) => {
    setCell(sheet, r, c, { numFmt, decimals })
  })
}

/** Clears the content of the range but keeps its formatting. */
export function clearContents(sheet, range) {
  eachCell(range, (r, c) => {
    const cell = getCell(sheet, r, c)
    if (!cell) return
    const { raw: _raw, value: _value, display: _display, ...rest } = cell
    sheet.data[r][c] = rest
  })
}

const isNumber = (cell) => cell && cell.value !== '' && Number.isFinite(Number(cell.value))

/**
 * Inserts an aggregate formula. With a multi-cell selection it fills the row below
 * each column; with a single cell it totals the contiguous numbers above, else to the left.
 *
 * @param {Object} sheet
 * @param {Range} range
 * @param {'SUM'|'AVERAGE'|'COUNT'|'MAX'|'MIN'} fn
 * @returns {boolean} whether a formula was written
 */
export function autoAggregate(sheet, range, fn = 'SUM') {
  const single = range.startRow === range.endRow && range.startCol === range.endCol
  if (!single) {
    for (let c = range.startCol; c <= range.endCol; c++) {
      const top = coordsToCellId(range.startRow, c)
      const bottom = coordsToCellId(range.endRow, c)
      setCell(sheet, range.endRow + 1, c, `=${fn}(${top}:${bottom})`)
    }
    return true
  }

  const { startRow: row, startCol: col } = range
  let top = row
  while (top > 0 && isNumber(getCell(sheet, top - 1, col))) top--
  if (top < row) {
    setCell(sheet, row, col, `=${fn}(${coordsToCellId(top, col)}:${coordsToCellId(row - 1, col)})`)
    return true
  }
  let left = col
  while (left > 0 && isNumber(getCell(sheet, row, left - 1))) left--
  if (left < col) {
    setCell(sheet, row, col, `=${fn}(${coordsToCellId(row, left)}:${coordsToCellId(row, col - 1)})`)
    return true
  }
  return false
}

/**
 * Sorts the rows of the range by one column. Numbers sort before text; blanks go last.
 * Formulas move with their row without rewriting relative references.
 *
 * @param {Object} sheet
 * @param {Range} range
 * @param {number} keyCol - Absolute column index used as the sort key
 * @param {boolean} [ascending=true]
 */
export function sortRange(sheet, range, keyCol, ascending = true) {
  const rows = []
  for (let r = range.startRow; r <= range.endRow; r++) {
    const cells = []
    for (let c = range.startCol; c <= range.endCol; c++) cells.push(getCell(sheet, r, c))
    rows.push({ cells, key: getCell(sheet, r, keyCol)?.value })
  }

  const rank = (v) => (v === undefined || v === '' ? 2 : Number.isFinite(Number(v)) ? 0 : 1)
  const dir = ascending ? 1 : -1
  rows.sort((a, b) => {
    const ra = rank(a.key)
    const rb = rank(b.key)
    if (ra === 2 || rb === 2) return ra - rb // blanks always last
    if (ra !== rb) return (ra - rb) * dir
    return (
      (ra === 0 ? Number(a.key) - Number(b.key) : String(a.key).localeCompare(String(b.key))) * dir
    )
  })

  rows.forEach((row, i) => {
    row.cells.forEach((cell, j) => {
      const r = range.startRow + i
      const c = range.startCol + j
      if (cell) sheet.data[r] = { ...sheet.data[r], [c]: cell }
      else if (sheet.data[r]) delete sheet.data[r][c]
    })
  })
}

/** Bounding box of all cells holding content, or null for an empty sheet. */
export function usedRange(sheet) {
  const rows = Object.keys(sheet.data || {}).map(Number)
  if (rows.length === 0) return null
  const cols = rows.flatMap((r) => Object.keys(sheet.data[r]).map(Number))
  return {
    startRow: Math.min(...rows),
    endRow: Math.max(...rows),
    startCol: Math.min(...cols),
    endCol: Math.max(...cols),
  }
}
