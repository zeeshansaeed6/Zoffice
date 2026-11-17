import { FormulaEngine } from './formula-engine.js'
import { formatNumber } from './number-format.js'

/**
 * Recomputes every cell value of a workbook (formulas, cross-sheet references,
 * dependents) and refreshes the number-format display text. Pure: returns a new workbook.
 *
 * @param {Object} workbook
 * @returns {Object}
 */
export function recalcWorkbook(workbook) {
  const engine = new FormulaEngine()
  try {
    workbook.sheets.forEach((s) => engine.ensureSheet(s.id, s.name))
    workbook.sheets.forEach((s) => engine.syncSheet(s))

    const sheets = workbook.sheets.map((sheet) => {
      const data = {}
      for (const [r, cols] of Object.entries(sheet.data || {})) {
        data[r] = {}
        for (const [c, cell] of Object.entries(cols)) {
          data[r][c] = recalcCell(engine, sheet.id, Number(r), Number(c), cell)
        }
      }
      return { ...sheet, data }
    })
    return { ...workbook, sheets }
  } finally {
    engine.destroy()
  }
}

function recalcCell(engine, sheetId, row, col, cell) {
  if (cell.raw === undefined) return { ...cell } // style-only cell
  const computed = engine.getCellValue(sheetId, row, col)
  const value = computed === null || computed === '' ? cell.raw : computed
  const next = { ...cell, value }
  const display = formatNumber(value, cell.numFmt, cell.decimals)
  if (display === null) delete next.display
  else next.display = display
  return next
}
