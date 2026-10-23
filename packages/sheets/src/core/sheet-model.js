import { DEFAULT_COL_WIDTH, DEFAULT_ROW_HEIGHT } from './grid-constants.js'

/**
 * Converts a 0-indexed column integer to an Excel-style letter column label (0 -> 'A', 27 -> 'AB').
 * @param {number} col
 * @returns {string}
 */
export function colIndexToLabel(col) {
  let label = ''
  let c = col
  while (c >= 0) {
    label = String.fromCharCode((c % 26) + 65) + label
    c = Math.floor(c / 26) - 1
  }
  return label
}

/**
 * Converts an Excel-style letter column label to a 0-indexed column integer ('A' -> 0, 'AB' -> 27).
 * @param {string} label
 * @returns {number}
 */
export function labelToColIndex(label) {
  let col = 0
  const clean = label.toUpperCase().trim()
  for (let i = 0; i < clean.length; i++) {
    col = col * 26 + (clean.charCodeAt(i) - 64)
  }
  return col - 1
}

/**
 * Parses an A1-notation cell reference into 0-indexed { row, col }.
 * @param {string} cellId - e.g. "B12" or "Sheet1!B12"
 * @returns {{ row: number, col: number, sheet?: string } | null}
 */
export function cellIdToCoords(cellId) {
  if (!cellId) return null
  let ref = cellId
  let sheet
  if (ref.includes('!')) {
    const parts = ref.split('!')
    sheet = parts[0].replace(/^'|'$/g, '')
    ref = parts[1]
  }
  const match = ref.match(/^([A-Za-z]+)(\d+)$/)
  if (!match) return null
  return {
    row: parseInt(match[2], 10) - 1,
    col: labelToColIndex(match[1]),
    sheet,
  }
}

/**
 * Formats 0-indexed row and column indices into an A1-notation string.
 * @param {number} row
 * @param {number} col
 * @returns {string}
 */
export function coordsToCellId(row, col) {
  return `${colIndexToLabel(col)}${row + 1}`
}

/**
 * Parses a range reference (e.g. "A1:B10") into bounding box coordinates.
 * @param {string} rangeStr
 * @returns {{ startRow: number, startCol: number, endRow: number, endCol: number } | null}
 */
export function parseRange(rangeStr) {
  if (!rangeStr) return null
  const clean = rangeStr.replace(/\$/g, '').trim()
  if (!clean.includes(':')) {
    const c = cellIdToCoords(clean)
    if (!c) return null
    return { startRow: c.row, startCol: c.col, endRow: c.row, endCol: c.col }
  }
  const [start, end] = clean.split(':')
  const c1 = cellIdToCoords(start)
  const c2 = cellIdToCoords(end)
  if (!c1 || !c2) return null
  return {
    startRow: Math.min(c1.row, c2.row),
    startCol: Math.min(c1.col, c2.col),
    endRow: Math.max(c1.row, c2.row),
    endCol: Math.max(c1.col, c2.col),
  }
}

/**
 * Formats a bounding box into an A1:B10 range string.
 * @param {{ startRow: number, startCol: number, endRow: number, endCol: number }} range
 * @returns {string}
 */
export function formatRange(range) {
  if (range.startRow === range.endRow && range.startCol === range.endCol) {
    return coordsToCellId(range.startRow, range.startCol)
  }
  return `${coordsToCellId(range.startRow, range.startCol)}:${coordsToCellId(range.endRow, range.endCol)}`
}

/**
 * Creates a blank sheet data structure.
 * @param {string} [id]
 * @param {string} [name='Sheet1']
 * @returns {Object}
 */
export function createSheet(id = `sheet_${Date.now()}`, name = 'Sheet1') {
  return {
    id,
    name,
    data: {}, // Sparse row -> col -> cell object map
    colWidths: {}, // colIndex -> width
    rowHeights: {}, // rowIndex -> height
    merges: [], // Array<{ startRow, startCol, endRow, endCol }>
  }
}

/**
 * Creates a blank workbook data structure.
 * @param {string} [firstSheetName='Sheet1']
 * @returns {Object}
 */
export function createWorkbook(firstSheetName = 'Sheet1') {
  const sheet1 = createSheet('sheet1', firstSheetName)
  return {
    activeSheetId: sheet1.id,
    sheets: [sheet1],
  }
}

/**
 * Gets cell data at given coordinates.
 * @param {Object} sheet
 * @param {number} row
 * @param {number} col
 * @returns {Object|null}
 */
export function getCell(sheet, row, col) {
  return sheet?.data?.[row]?.[col] || null
}

/**
 * Sets cell data at given coordinates.
 * @param {Object} sheet
 * @param {number} row
 * @param {number} col
 * @param {Object|string|number} cellData
 */
export function setCell(sheet, row, col, cellData) {
  if (!sheet) return
  if (!sheet.data[row]) {
    sheet.data[row] = {}
  }
  if (cellData === null || cellData === undefined || cellData === '') {
    delete sheet.data[row][col]
    if (Object.keys(sheet.data[row]).length === 0) {
      delete sheet.data[row]
    }
    return
  }

  const existing = sheet.data[row][col] || {}
  const normalized =
    typeof cellData === 'object'
      ? { ...existing, ...cellData }
      : { ...existing, raw: String(cellData), value: cellData }

  sheet.data[row][col] = normalized
}

/**
 * Gets column width taking custom overrides into account.
 * @param {Object} sheet
 * @param {number} col
 * @returns {number}
 */
export function getColWidth(sheet, col) {
  return sheet?.colWidths?.[col] || DEFAULT_COL_WIDTH
}

/**
 * Gets row height taking custom overrides into account.
 * @param {Object} sheet
 * @param {number} row
 * @returns {number}
 */
export function getRowHeight(sheet, row) {
  return sheet?.rowHeights?.[row] || DEFAULT_ROW_HEIGHT
}
