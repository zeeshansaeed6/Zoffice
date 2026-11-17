import { FormulaEngine } from './formula-engine.js'

/**
 * Inserting or deleting rows/columns. HyperFormula rewrites formula references
 * (including those on other sheets) so they keep pointing at the same data.
 */

const AXES = {
  row: { add: 'addRows', remove: 'removeRows' },
  col: { add: 'addColumns', remove: 'removeColumns' },
}

/**
 * @param {Object} workbook
 * @param {'row'|'col'} axis
 * @param {'insert'|'delete'} action
 * @param {number} index - First affected row/column (0-based)
 * @param {number} [count=1]
 * @returns {Object} new workbook (call recalcWorkbook afterwards)
 */
export function changeStructure(workbook, axis, action, index, count = 1) {
  const engine = new FormulaEngine()
  try {
    workbook.sheets.forEach((s) => engine.ensureSheet(s.id, s.name))
    workbook.sheets.forEach((s) => engine.syncSheet(s))

    const activeHfId = engine.sheetMapping.get(workbook.activeSheetId)
    const method = AXES[axis][action === 'insert' ? 'add' : 'remove']
    engine.hf[method](activeHfId, [index, count])

    const shift = (pos) => {
      if (action === 'insert') return pos >= index ? pos + count : pos
      if (pos >= index + count) return pos - count
      return pos >= index ? null : pos // deleted
    }

    const sheets = workbook.sheets.map((sheet) => {
      const isActive = sheet.id === workbook.activeSheetId
      const hfId = engine.sheetMapping.get(sheet.id)
      const data = {}
      for (const [r, cols] of Object.entries(sheet.data || {})) {
        for (const [c, cell] of Object.entries(cols)) {
          const row = isActive && axis === 'row' ? shift(Number(r)) : Number(r)
          const col = isActive && axis === 'col' ? shift(Number(c)) : Number(c)
          if (row === null || col === null) continue
          const next = { ...cell }
          if (typeof cell.raw === 'string' && cell.raw.startsWith('=')) {
            const serialized = engine.hf.getCellSerialized({ sheet: hfId, row, col })
            if (typeof serialized === 'string') next.raw = serialized
          }
          data[row] = { ...data[row], [col]: next }
        }
      }
      return isActive ? { ...sheet, data, ...shiftSizes(sheet, axis, shift) } : { ...sheet, data }
    })
    return { ...workbook, sheets }
  } finally {
    engine.destroy()
  }
}

function shiftSizes(sheet, axis, shift) {
  const key = axis === 'row' ? 'rowHeights' : 'colWidths'
  const next = {}
  for (const [pos, size] of Object.entries(sheet[key] || {})) {
    const moved = shift(Number(pos))
    if (moved !== null) next[moved] = size
  }
  return { [key]: next }
}
