export const FILL_HANDLE_SIZE = 6

/**
 * Normalizes two arbitrary cell coordinates into an ordered bounding box range.
 *
 * @param {number} r1
 * @param {number} c1
 * @param {number} r2
 * @param {number} c2
 * @returns {{ startRow: number, startCol: number, endRow: number, endCol: number }}
 */
export function normalizeRange(r1, c1, r2, c2) {
  return {
    startRow: Math.min(r1, r2),
    startCol: Math.min(c1, c2),
    endRow: Math.max(r1, r2),
    endCol: Math.max(c1, c2),
  }
}

/**
 * Checks if a specific cell coordinate lies inside a selection range.
 *
 * @param {number} row
 * @param {number} col
 * @param {{ startRow: number, startCol: number, endRow: number, endCol: number }} range
 * @returns {boolean}
 */
export function isCellInRange(row, col, range) {
  if (!range) return false
  return (
    row >= range.startRow && row <= range.endRow && col >= range.startCol && col <= range.endCol
  )
}

/**
 * Checks if a specific cell is the current active anchor cell.
 *
 * @param {number} row
 * @param {number} col
 * @param {{ row: number, col: number }} activeCell
 * @returns {boolean}
 */
export function isCellActive(row, col, activeCell) {
  if (!activeCell) return false
  return row === activeCell.row && col === activeCell.col
}

/**
 * Calculates the canvas pixel bounding box of the selection fill handle (bottom-right corner).
 *
 * @param {{ x: number, y: number, width: number, height: number }} rangeRect
 * @returns {{ x: number, y: number, width: number, height: number }}
 */
export function getFillHandleRect(rangeRect) {
  const half = FILL_HANDLE_SIZE / 2
  return {
    x: rangeRect.x + rangeRect.width - half,
    y: rangeRect.y + rangeRect.height - half,
    width: FILL_HANDLE_SIZE,
    height: FILL_HANDLE_SIZE,
  }
}

/**
 * Determines whether a mouse coordinate is hovering over the fill handle.
 *
 * @param {number} x
 * @param {number} y
 * @param {{ x: number, y: number, width: number, height: number }} rangeRect
 * @returns {boolean}
 */
export function isPointInFillHandle(x, y, rangeRect) {
  const handle = getFillHandleRect(rangeRect)
  const pad = 3 // hit-test padding
  return (
    x >= handle.x - pad &&
    x <= handle.x + handle.width + pad &&
    y >= handle.y - pad &&
    y <= handle.y + handle.height + pad
  )
}
