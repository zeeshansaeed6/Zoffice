import {
  ROW_HEADER_WIDTH,
  COL_HEADER_HEIGHT,
  RESIZE_HANDLE_ZONE,
  MAX_ROWS,
  MAX_COLS,
} from '../core/grid-constants.js'
import { getColWidth, getRowHeight } from '../core/sheet-model.js'

/**
 * Computes the visible range of rows and columns within the canvas viewport.
 *
 * @param {Object} options
 * @param {number} options.scrollX - Current horizontal scroll position in pixels
 * @param {number} options.scrollY - Current vertical scroll position in pixels
 * @param {number} options.width - Available canvas viewport width in pixels
 * @param {number} options.height - Available canvas viewport height in pixels
 * @param {Object} options.sheet - Active sheet model
 * @returns {Object}
 */
export function getVisibleRange({ scrollX, scrollY, width, height, sheet }) {
  // Compute visible columns
  let currentX = 0
  let startCol = 0
  while (currentX < scrollX && startCol < MAX_COLS) {
    const w = getColWidth(sheet, startCol)
    if (currentX + w > scrollX) break
    currentX += w
    startCol++
  }

  let endCol = startCol
  let renderWidth = currentX - scrollX
  const gridContentWidth = width - ROW_HEADER_WIDTH
  while (renderWidth < gridContentWidth && endCol < MAX_COLS) {
    renderWidth += getColWidth(sheet, endCol)
    endCol++
  }

  // Compute visible rows
  let currentY = 0
  let startRow = 0
  while (currentY < scrollY && startRow < MAX_ROWS) {
    const h = getRowHeight(sheet, startRow)
    if (currentY + h > scrollY) break
    currentY += h
    startRow++
  }

  let endRow = startRow
  let renderHeight = currentY - scrollY
  const gridContentHeight = height - COL_HEADER_HEIGHT
  while (renderHeight < gridContentHeight && endRow < MAX_ROWS) {
    renderHeight += getRowHeight(sheet, endRow)
    endRow++
  }

  return {
    startCol,
    endCol: Math.min(MAX_COLS - 1, endCol + 1),
    startRow,
    endRow: Math.min(MAX_ROWS - 1, endRow + 1),
    startColX: currentX,
    startRowY: currentY,
  }
}

/**
 * Gets the canvas pixel rectangle for a given cell.
 *
 * @param {Object} options
 * @param {number} options.row
 * @param {number} options.col
 * @param {number} options.scrollX
 * @param {number} options.scrollY
 * @param {Object} options.sheet
 * @returns {{ x: number, y: number, width: number, height: number }}
 */
export function getCellRect({ row, col, scrollX, scrollY, sheet }) {
  let x = ROW_HEADER_WIDTH - scrollX
  for (let c = 0; c < col; c++) {
    x += getColWidth(sheet, c)
  }
  const width = getColWidth(sheet, col)

  let y = COL_HEADER_HEIGHT - scrollY
  for (let r = 0; r < row; r++) {
    y += getRowHeight(sheet, r)
  }
  const height = getRowHeight(sheet, row)

  return { x, y, width, height }
}

/**
 * Gets the canvas pixel rectangle for a bounding range.
 *
 * @param {Object} options
 * @param {Object} options.range
 * @param {number} options.scrollX
 * @param {number} options.scrollY
 * @param {Object} options.sheet
 * @returns {{ x: number, y: number, width: number, height: number }}
 */
export function getRangeRect({ range, scrollX, scrollY, sheet }) {
  const topLeft = getCellRect({
    row: range.startRow,
    col: range.startCol,
    scrollX,
    scrollY,
    sheet,
  })
  const bottomRight = getCellRect({
    row: range.endRow,
    col: range.endCol,
    scrollX,
    scrollY,
    sheet,
  })

  return {
    x: topLeft.x,
    y: topLeft.y,
    width: bottomRight.x + bottomRight.width - topLeft.x,
    height: bottomRight.y + bottomRight.height - topLeft.y,
  }
}

/**
 * Maps a mouse canvas point (x, y) to cell coordinates or header hit areas.
 *
 * @param {Object} options
 * @param {number} options.x - Mouse X relative to canvas
 * @param {number} options.y - Mouse Y relative to canvas
 * @param {number} options.scrollX
 * @param {number} options.scrollY
 * @param {Object} options.sheet
 * @returns {{ row: number, col: number, isRowHeader: boolean, isColHeader: boolean, isCorner: boolean }}
 */
export function getCellAtPoint({ x, y, scrollX, scrollY, sheet }) {
  const isCorner = x < ROW_HEADER_WIDTH && y < COL_HEADER_HEIGHT
  const isRowHeader = x < ROW_HEADER_WIDTH && y >= COL_HEADER_HEIGHT
  const isColHeader = y < COL_HEADER_HEIGHT && x >= ROW_HEADER_WIDTH

  // Find column
  let col = 0
  if (x >= ROW_HEADER_WIDTH) {
    let curX = ROW_HEADER_WIDTH - scrollX
    while (col < MAX_COLS) {
      const w = getColWidth(sheet, col)
      if (x >= curX && x < curX + w) break
      curX += w
      col++
    }
  }

  // Find row
  let row = 0
  if (y >= COL_HEADER_HEIGHT) {
    let curY = COL_HEADER_HEIGHT - scrollY
    while (row < MAX_ROWS) {
      const h = getRowHeight(sheet, row)
      if (y >= curY && y < curY + h) break
      curY += h
      row++
    }
  }

  return { row, col, isRowHeader, isColHeader, isCorner }
}

/**
 * Checks if mouse is hovering over a column or row resize handle.
 *
 * @param {Object} options
 * @param {number} options.x
 * @param {number} options.y
 * @param {number} options.scrollX
 * @param {number} options.scrollY
 * @param {Object} options.sheet
 * @returns {{ type: 'col'|'row', index: number } | null}
 */
export function getHeaderSeparatorAtPoint({ x, y, scrollX, scrollY, sheet }) {
  // Check column resize separator (on column header bar)
  if (y < COL_HEADER_HEIGHT && x >= ROW_HEADER_WIDTH) {
    let curX = ROW_HEADER_WIDTH - scrollX
    for (let c = 0; c < MAX_COLS; c++) {
      curX += getColWidth(sheet, c)
      if (Math.abs(x - curX) <= RESIZE_HANDLE_ZONE) {
        return { type: 'col', index: c }
      }
      if (curX > x + RESIZE_HANDLE_ZONE) break
    }
  }

  // Check row resize separator (on row header bar)
  if (x < ROW_HEADER_WIDTH && y >= COL_HEADER_HEIGHT) {
    let curY = COL_HEADER_HEIGHT - scrollY
    for (let r = 0; r < MAX_ROWS; r++) {
      curY += getRowHeight(sheet, r)
      if (Math.abs(y - curY) <= RESIZE_HANDLE_ZONE) {
        return { type: 'row', index: r }
      }
      if (curY > y + RESIZE_HANDLE_ZONE) break
    }
  }

  return null
}
