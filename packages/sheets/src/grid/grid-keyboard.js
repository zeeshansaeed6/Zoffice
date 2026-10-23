import { normalizeRange } from './grid-selection.js'
import { MAX_ROWS, MAX_COLS } from '../core/grid-constants.js'

/**
 * Handles keyboard events on the grid canvas.
 *
 * @param {KeyboardEvent} e
 * @param {Object} ctx
 * @returns {Object|null}
 */
export function handleKeyDown(e, ctx) {
  const { activeCell, selectedRange, isEditing } = ctx
  if (!activeCell) return null

  // If in edit mode, let Enter / Tab / Escape commit or cancel
  if (isEditing) {
    if (e.key === 'Enter') {
      e.preventDefault()
      return { type: 'commit_edit', moveNext: e.shiftKey ? 'up' : 'down' }
    }
    if (e.key === 'Tab') {
      e.preventDefault()
      return { type: 'commit_edit', moveNext: e.shiftKey ? 'left' : 'right' }
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      return { type: 'cancel_edit' }
    }
    return null
  }

  // F2: Enter edit mode
  if (e.key === 'F2') {
    e.preventDefault()
    return { type: 'start_edit' }
  }

  // Delete / Backspace: Clear cell range
  if (e.key === 'Delete' || e.key === 'Backspace') {
    e.preventDefault()
    return { type: 'clear_range' }
  }

  // Navigation Keys
  let dRow = 0
  let dCol = 0

  switch (e.key) {
    case 'ArrowUp':
      dRow = e.ctrlKey ? -activeCell.row : -1
      break
    case 'ArrowDown':
      dRow = e.ctrlKey ? 100 : 1
      break
    case 'ArrowLeft':
      dCol = e.ctrlKey ? -activeCell.col : -1
      break
    case 'ArrowRight':
      dCol = e.ctrlKey ? 10 : 1
      break
    case 'Tab':
      dCol = e.shiftKey ? -1 : 1
      break
    case 'Enter':
      dRow = e.shiftKey ? -1 : 1
      break
    case 'Home':
      dCol = -activeCell.col
      if (e.ctrlKey) dRow = -activeCell.row
      break
    case 'PageUp':
      dRow = -25
      break
    case 'PageDown':
      dRow = 25
      break
    default:
      // Printable characters start editing automatically
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        return { type: 'start_edit_with_char', char: e.key }
      }
      return null
  }

  e.preventDefault()

  const targetRow = Math.max(0, Math.min(MAX_ROWS - 1, activeCell.row + dRow))
  const targetCol = Math.max(0, Math.min(MAX_COLS - 1, activeCell.col + dCol))

  if (e.shiftKey && e.key.startsWith('Arrow')) {
    // Expand selection range
    const anchor = {
      row: selectedRange ? selectedRange.startRow : activeCell.row,
      col: selectedRange ? selectedRange.startCol : activeCell.col,
    }
    return {
      type: 'navigate_select',
      activeCell: { row: targetRow, col: targetCol },
      range: normalizeRange(anchor.row, anchor.col, targetRow, targetCol),
    }
  }

  return {
    type: 'navigate',
    activeCell: { row: targetRow, col: targetCol },
    range: { startRow: targetRow, startCol: targetCol, endRow: targetRow, endCol: targetCol },
  }
}
