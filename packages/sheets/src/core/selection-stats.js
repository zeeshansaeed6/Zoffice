import { getCell } from './sheet-model.js'

/**
 * Status-bar summary (Count, Sum, Average) of the selected range.
 * @param {Object} sheet
 * @param {{ startRow: number, startCol: number, endRow: number, endCol: number }} range
 * @returns {string}
 */
export function summarizeSelection(sheet, range) {
  let count = 0
  let numericCount = 0
  let sum = 0
  for (let r = range.startRow; r <= range.endRow; r++) {
    for (let c = range.startCol; c <= range.endCol; c++) {
      const cell = getCell(sheet, r, c)
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
  if (numericCount === 0) return count > 0 ? `Count: ${count}` : 'Ready'
  const avg = (sum / numericCount).toFixed(2).replace(/\.00$/, '')
  return `Count: ${count} | Sum: ${sum} | Average: ${avg}`
}
