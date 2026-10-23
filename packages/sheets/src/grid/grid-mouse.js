import { getCellAtPoint, getHeaderSeparatorAtPoint, getRangeRect } from './grid-viewport.js'
import { normalizeRange, isPointInFillHandle } from './grid-selection.js'
import { MIN_COL_WIDTH, MIN_ROW_HEIGHT, MAX_ROWS, MAX_COLS } from '../core/grid-constants.js'

/**
 * Handles pointer down on the canvas grid.
 *
 * @param {MouseEvent} e
 * @param {Object} ctx
 * @returns {Object|null}
 */
export function handleMouseDown(e, ctx) {
  const { x, y, sheet, scrollX, scrollY, activeCell, selectedRange } = ctx

  // 1. Check resize separator
  const separator = getHeaderSeparatorAtPoint({ x, y, scrollX, scrollY, sheet })
  if (separator) {
    return {
      type: 'resize',
      target: separator.type,
      index: separator.index,
      startX: x,
      startY: y,
    }
  }

  // 2. Check fill handle
  if (selectedRange) {
    const rangeRect = getRangeRect({ range: selectedRange, scrollX, scrollY, sheet })
    if (isPointInFillHandle(x, y, rangeRect)) {
      return {
        type: 'fill',
        startRange: selectedRange,
        currentRange: selectedRange,
      }
    }
  }

  // 3. Normal cell or header click
  const hit = getCellAtPoint({ x, y, scrollX, scrollY, sheet })

  if (hit.isCorner) {
    return {
      type: 'select_all',
      range: { startRow: 0, startCol: 0, endRow: MAX_ROWS - 1, endCol: MAX_COLS - 1 },
      activeCell: { row: 0, col: 0 },
    }
  }

  if (hit.isColHeader) {
    return {
      type: 'select_col',
      col: hit.col,
      range: { startRow: 0, startCol: hit.col, endRow: MAX_ROWS - 1, endCol: hit.col },
      activeCell: { row: 0, col: hit.col },
      isDragging: true,
    }
  }

  if (hit.isRowHeader) {
    return {
      type: 'select_row',
      row: hit.row,
      range: { startRow: hit.row, startCol: 0, endRow: hit.row, endCol: MAX_COLS - 1 },
      activeCell: { row: hit.row, col: 0 },
      isDragging: true,
    }
  }

  // Shift + Click expands range
  if (e.shiftKey && activeCell) {
    return {
      type: 'range_select',
      range: normalizeRange(activeCell.row, activeCell.col, hit.row, hit.col),
      activeCell,
      isDragging: false,
    }
  }

  // Regular single cell click & begin drag
  return {
    type: 'cell_select',
    anchor: { row: hit.row, col: hit.col },
    activeCell: { row: hit.row, col: hit.col },
    range: { startRow: hit.row, startCol: hit.col, endRow: hit.row, endCol: hit.col },
    isDragging: true,
  }
}

/**
 * Handles pointer move and determines cursor styling.
 *
 * @param {MouseEvent} _e
 * @param {Object} ctx
 * @returns {{ cursor: string, nextState?: Object }}
 */
export function handleMouseMove(_e, ctx) {
  const { x, y, sheet, scrollX, scrollY, dragAction, selectedRange } = ctx

  if (dragAction) {
    if (dragAction.type === 'resize') {
      const pos = dragAction.target === 'col' ? x : y
      return {
        cursor: dragAction.target === 'col' ? 'col-resize' : 'row-resize',
        nextState: {
          resizeIndicator: { type: dragAction.target, pos },
        },
      }
    }

    if (dragAction.type === 'cell_select' && dragAction.isDragging) {
      const hit = getCellAtPoint({ x, y, scrollX, scrollY, sheet })
      const newRange = normalizeRange(
        dragAction.anchor.row,
        dragAction.anchor.col,
        hit.row,
        hit.col,
      )
      return {
        cursor: 'cell',
        nextState: { selectedRange: newRange },
      }
    }

    if (dragAction.type === 'select_col' && dragAction.isDragging) {
      const hit = getCellAtPoint({ x, y, scrollX, scrollY, sheet })
      const minCol = Math.min(dragAction.col, hit.col)
      const maxCol = Math.max(dragAction.col, hit.col)
      return {
        cursor: 'default',
        nextState: {
          selectedRange: { startRow: 0, startCol: minCol, endRow: MAX_ROWS - 1, endCol: maxCol },
        },
      }
    }

    if (dragAction.type === 'select_row' && dragAction.isDragging) {
      const hit = getCellAtPoint({ x, y, scrollX, scrollY, sheet })
      const minRow = Math.min(dragAction.row, hit.row)
      const maxRow = Math.max(dragAction.row, hit.row)
      return {
        cursor: 'default',
        nextState: {
          selectedRange: { startRow: minRow, startCol: 0, endRow: maxRow, endCol: MAX_COLS - 1 },
        },
      }
    }
  }

  // Hover cursor state detection
  const separator = getHeaderSeparatorAtPoint({ x, y, scrollX, scrollY, sheet })
  if (separator) {
    return { cursor: separator.type === 'col' ? 'col-resize' : 'row-resize' }
  }

  if (selectedRange) {
    const rangeRect = getRangeRect({ range: selectedRange, scrollX, scrollY, sheet })
    if (isPointInFillHandle(x, y, rangeRect)) {
      return { cursor: 'crosshair' }
    }
  }

  const hit = getCellAtPoint({ x, y, scrollX, scrollY, sheet })
  if (hit.isColHeader || hit.isRowHeader || hit.isCorner) {
    return { cursor: 'default' }
  }

  return { cursor: 'cell' }
}

/**
 * Handles pointer up and finalizes resizing or selection.
 *
 * @param {Object} ctx
 * @returns {Object}
 */
export function handleMouseUp(ctx) {
  const { dragAction, x, y, sheet, scrollX, scrollY } = ctx
  if (!dragAction) return {}

  if (dragAction.type === 'resize') {
    if (dragAction.target === 'col') {
      const delta = x - dragAction.startX
      const currentW = sheet.colWidths?.[dragAction.index] || 100
      const newWidth = Math.max(MIN_COL_WIDTH, currentW + delta)
      return {
        type: 'resize_col',
        col: dragAction.index,
        width: newWidth,
      }
    }
    const delta = y - dragAction.startY
    const currentH = sheet.rowHeights?.[dragAction.index] || 24
    const newHeight = Math.max(MIN_ROW_HEIGHT, currentH + delta)
    return {
      type: 'resize_row',
      row: dragAction.index,
      height: newHeight,
    }
  }

  if (dragAction.type === 'cell_select' && dragAction.isDragging) {
    const hit = getCellAtPoint({ x, y, scrollX, scrollY, sheet })
    const finalRange = normalizeRange(
      dragAction.anchor.row,
      dragAction.anchor.col,
      hit.row,
      hit.col,
    )
    return {
      type: 'commit_selection',
      range: finalRange,
    }
  }

  return { type: 'clear' }
}
