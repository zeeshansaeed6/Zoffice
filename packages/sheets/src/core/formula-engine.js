import { HyperFormula } from 'hyperformula'

/**
 * Formula engine wrapping HyperFormula for spreadsheet calculations.
 * Supports 300+ Excel functions, cross-sheet references, and automatic dependency recalculation.
 */
export class FormulaEngine {
  /**
   * @param {Object} [options]
   * @param {string} [options.licenseKey='gpl-v3']
   */
  constructor(options = {}) {
    this.hf = HyperFormula.buildEmpty({
      licenseKey: options.licenseKey || 'gpl-v3',
      useArrayArithmetic: true,
      useColumnIndex: true,
    })
    /** @type {Map<string, number>} mapping sheetId to HyperFormula sheetId */
    this.sheetMapping = new Map()
  }

  /**
   * Register or sync a sheet with HyperFormula.
   *
   * @param {string} sheetId
   * @param {string} sheetName
   * @returns {number} HyperFormula internal sheet ID
   */
  ensureSheet(sheetId, sheetName) {
    if (this.sheetMapping.has(sheetId)) {
      return this.sheetMapping.get(sheetId)
    }

    try {
      // If sheetName already exists in HF, use its id
      const existingId = this.hf.getSheetId(sheetName)
      if (existingId !== undefined) {
        this.sheetMapping.set(sheetId, existingId)
        return existingId
      }
    } catch {
      // Sheet doesn't exist yet
    }

    const hfSheetName = this.hf.addSheet(sheetName)
    const hfSheetId = this.hf.getSheetId(hfSheetName)
    this.sheetMapping.set(sheetId, hfSheetId)
    return hfSheetId
  }

  /**
   * Set a cell value or formula in HyperFormula.
   *
   * @param {string} sheetId
   * @param {number} row 0-indexed row
   * @param {number} col 0-indexed column
   * @param {string | number | boolean | null} raw
   */
  setCell(sheetId, row, col, raw) {
    const hfSheetId = this.sheetMapping.get(sheetId)
    if (hfSheetId === undefined) return

    let valueToSet = raw
    if (raw === null || raw === undefined) {
      valueToSet = ''
    }

    this.hf.setCellContents(
      {
        sheet: hfSheetId,
        row,
        col,
      },
      [[valueToSet]],
    )
  }

  /**
   * Get the calculated value of a cell.
   *
   * @param {string} sheetId
   * @param {number} row
   * @param {number} col
   * @returns {any}
   */
  getCellValue(sheetId, row, col) {
    const hfSheetId = this.sheetMapping.get(sheetId)
    if (hfSheetId === undefined) return null

    try {
      const val = this.hf.getCellValue({
        sheet: hfSheetId,
        row,
        col,
      })
      // HyperFormula returns DetailedCellError object for errors
      if (val && typeof val === 'object' && val.value) {
        return val.value
      }
      return val
    } catch {
      return '#ERROR!'
    }
  }

  /**
   * Sync an entire sheet model's cells into the engine.
   *
   * @param {Object} sheet - Sheet object containing id, name, data
   */
  syncSheet(sheet) {
    const hfSheetId = this.ensureSheet(sheet.id, sheet.name)
    if (!sheet.data) return

    for (const [rStr, cols] of Object.entries(sheet.data)) {
      const row = parseInt(rStr, 10)
      for (const [cStr, cell] of Object.entries(cols)) {
        const col = parseInt(cStr, 10)
        const val = cell.raw !== undefined ? cell.raw : cell.value
        this.hf.setCellContents({ sheet: hfSheetId, row, col }, [[val]])
      }
    }
  }

  /**
   * Destroy the HyperFormula instance.
   */
  destroy() {
    if (this.hf) {
      this.hf.destroy()
      this.sheetMapping.clear()
    }
  }
}
