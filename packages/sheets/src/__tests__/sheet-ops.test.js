import { describe, it, expect } from 'vitest'
import { createWorkbook, setCell, getCell } from '../core/sheet-model.js'
import { recalcWorkbook } from '../core/recalc.js'
import { formatNumber } from '../core/number-format.js'
import {
  updateActiveSheet,
  applyStyle,
  applyNumberFormat,
  autoAggregate,
  sortRange,
  clearContents,
} from '../core/sheet-ops.js'
import { changeStructure } from '../core/structure-ops.js'

const build = (cells) => {
  const wb = createWorkbook()
  const filled = updateActiveSheet(wb, (s) => cells.forEach(([r, c, v]) => setCell(s, r, c, v)))
  return recalcWorkbook(filled)
}
const sheetOf = (wb) => wb.sheets[0]
const val = (wb, r, c) => getCell(sheetOf(wb), r, c)?.value
const range = (startRow, startCol, endRow, endCol) => ({ startRow, startCol, endRow, endCol })

describe('ZSheets core operations', () => {
  it('recalculates dependents when a precedent changes', () => {
    let wb = build([
      [0, 0, 2],
      [0, 1, '=A1*10'],
    ])
    expect(val(wb, 0, 1)).toBe(20)
    wb = recalcWorkbook(updateActiveSheet(wb, (s) => setCell(s, 0, 0, 5)))
    expect(val(wb, 0, 1)).toBe(50)
  })

  it('formats numbers for display without changing values', () => {
    expect(formatNumber(1234.5, 'currency')).toBe('$1,234.50')
    expect(formatNumber(-3, 'currency', 0)).toBe('-$3')
    expect(formatNumber(0.256, 'percent', 1)).toBe('25.6%')
    expect(formatNumber('text', 'currency')).toBeNull()
    let wb = build([[0, 0, 0.5]])
    wb = recalcWorkbook(
      updateActiveSheet(wb, (s) => applyNumberFormat(s, range(0, 0, 0, 0), 'percent', 0)),
    )
    expect(getCell(sheetOf(wb), 0, 0)).toMatchObject({ value: 0.5, display: '50%' })
  })

  it('styles empty cells and clears content but keeps formatting', () => {
    let wb = build([[0, 0, 'x']])
    wb = updateActiveSheet(wb, (s) => {
      applyStyle(s, range(0, 0, 1, 1), { bold: true, bgColor: '#fef08a' })
      clearContents(s, range(0, 0, 0, 0))
    })
    expect(getCell(sheetOf(wb), 1, 1).style).toMatchObject({ bold: true })
    const cleared = getCell(sheetOf(wb), 0, 0)
    expect(cleared.raw).toBeUndefined()
    expect(cleared.style.bgColor).toBe('#fef08a')
  })

  it('autosums above a single cell and below a multi-row selection', () => {
    let wb = build([
      [0, 0, 1],
      [1, 0, 2],
      [2, 0, 3],
    ])
    wb = recalcWorkbook(updateActiveSheet(wb, (s) => autoAggregate(s, range(3, 0, 3, 0))))
    expect(val(wb, 3, 0)).toBe(6)
    wb = recalcWorkbook(updateActiveSheet(wb, (s) => autoAggregate(s, range(0, 0, 2, 0), 'MAX')))
    expect(getCell(sheetOf(wb), 3, 0).raw).toBe('=MAX(A1:A3)')
    expect(val(wb, 3, 0)).toBe(3)
  })

  it('sorts rows by a column, numbers before text, blanks last', () => {
    let wb = build([
      [0, 0, 'b'],
      [0, 1, 1],
      [1, 0, 'a'],
      [1, 1, 10],
      [2, 1, 5],
    ])
    wb = updateActiveSheet(wb, (s) => sortRange(s, range(0, 0, 2, 1), 1, false))
    expect([val(wb, 0, 1), val(wb, 1, 1), val(wb, 2, 1)]).toEqual([10, 5, 1])
    expect(val(wb, 0, 0)).toBe('a')
    wb = updateActiveSheet(wb, (s) => sortRange(s, range(0, 0, 2, 1), 0, true))
    expect(val(wb, 0, 0)).toBe('a')
    expect(getCell(sheetOf(wb), 2, 0)).toBeNull() // blank sorts last
  })

  it('inserts and deletes rows while keeping formulas pointing at their data', () => {
    let wb = build([
      [0, 0, 4],
      [1, 0, 6],
      [2, 0, '=SUM(A1:A2)'],
    ])
    wb = recalcWorkbook(changeStructure(wb, 'row', 'insert', 1))
    expect(val(wb, 1, 0)).toBeUndefined()
    expect(val(wb, 3, 0)).toBe(10)
    expect(getCell(sheetOf(wb), 3, 0).raw).toBe('=SUM(A1:A3)')
    wb = recalcWorkbook(changeStructure(wb, 'row', 'delete', 1))
    expect(getCell(sheetOf(wb), 2, 0).raw).toBe('=SUM(A1:A2)')
    expect(val(wb, 2, 0)).toBe(10)
  })

  it('inserts columns', () => {
    let wb = build([
      [0, 0, 3],
      [0, 1, '=A1+1'],
    ])
    wb = recalcWorkbook(changeStructure(wb, 'col', 'insert', 0))
    expect(getCell(sheetOf(wb), 0, 2).raw).toBe('=B1+1')
    expect(val(wb, 0, 2)).toBe(4)
  })
})
