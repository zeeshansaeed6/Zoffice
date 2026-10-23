import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { FormulaEngine } from '../core/formula-engine.js'

describe('FormulaEngine with HyperFormula', () => {
  let engine

  beforeEach(() => {
    engine = new FormulaEngine()
    engine.ensureSheet('sheet1', 'Sheet1')
  })

  afterEach(() => {
    engine.destroy()
  })

  describe('Basic Arithmetic and Operators', () => {
    it('evaluates constant additions and subtractions', () => {
      engine.setCell('sheet1', 0, 0, '=10 + 25 - 5')
      expect(engine.getCellValue('sheet1', 0, 0)).toBe(30)
    })

    it('evaluates multiplication, division, and exponents', () => {
      engine.setCell('sheet1', 0, 0, '=(5 * 4) / 2 + 3^2')
      expect(engine.getCellValue('sheet1', 0, 0)).toBe(19)
    })

    it('handles cell references dynamically', () => {
      engine.setCell('sheet1', 0, 0, 100) // A1
      engine.setCell('sheet1', 0, 1, 50) // B1
      engine.setCell('sheet1', 0, 2, '=A1 + B1 * 2') // C1
      expect(engine.getCellValue('sheet1', 0, 2)).toBe(200)

      // update A1 and verify recalc
      engine.setCell('sheet1', 0, 0, 200)
      expect(engine.getCellValue('sheet1', 0, 2)).toBe(300)
    })
  })

  describe('Math and Statistical Functions', () => {
    beforeEach(() => {
      // Setup column A: 10, 20, 30, 40, 50 (A1:A5)
      for (let i = 0; i < 5; i++) {
        engine.setCell('sheet1', i, 0, (i + 1) * 10)
      }
    })

    it('evaluates SUM, AVERAGE, MIN, MAX', () => {
      engine.setCell('sheet1', 5, 0, '=SUM(A1:A5)')
      expect(engine.getCellValue('sheet1', 5, 0)).toBe(150)

      engine.setCell('sheet1', 6, 0, '=AVERAGE(A1:A5)')
      expect(engine.getCellValue('sheet1', 6, 0)).toBe(30)

      engine.setCell('sheet1', 7, 0, '=MIN(A1:A5)')
      expect(engine.getCellValue('sheet1', 7, 0)).toBe(10)

      engine.setCell('sheet1', 8, 0, '=MAX(A1:A5)')
      expect(engine.getCellValue('sheet1', 8, 0)).toBe(50)
    })

    it('evaluates COUNT, COUNTA, COUNTIF, SUMIF', () => {
      engine.setCell('sheet1', 0, 1, '=COUNT(A1:A5)')
      expect(engine.getCellValue('sheet1', 0, 1)).toBe(5)

      engine.setCell('sheet1', 1, 1, '=COUNTIF(A1:A5, ">25")')
      expect(engine.getCellValue('sheet1', 1, 1)).toBe(3)

      engine.setCell('sheet1', 2, 1, '=SUMIF(A1:A5, ">20")')
      expect(engine.getCellValue('sheet1', 2, 1)).toBe(120)
    })

    it('evaluates ROUND, ROUNDUP, ROUNDDOWN, ABS, SQRT', () => {
      engine.setCell('sheet1', 0, 2, '=ROUND(3.14159, 2)')
      expect(engine.getCellValue('sheet1', 0, 2)).toBe(3.14)

      engine.setCell('sheet1', 1, 2, '=ROUNDUP(3.141, 1)')
      expect(engine.getCellValue('sheet1', 1, 2)).toBe(3.2)

      engine.setCell('sheet1', 2, 2, '=ROUNDDOWN(3.149, 1)')
      expect(engine.getCellValue('sheet1', 2, 2)).toBe(3.1)

      engine.setCell('sheet1', 3, 2, '=ABS(-42)')
      expect(engine.getCellValue('sheet1', 3, 2)).toBe(42)

      engine.setCell('sheet1', 4, 2, '=SQRT(144)')
      expect(engine.getCellValue('sheet1', 4, 2)).toBe(12)
    })

    it('evaluates MEDIAN, MODE, STDEV, LARGE, SMALL', () => {
      engine.setCell('sheet1', 0, 3, '=MEDIAN(A1:A5)')
      expect(engine.getCellValue('sheet1', 0, 3)).toBe(30)

      engine.setCell('sheet1', 1, 3, '=LARGE(A1:A5, 2)')
      expect(engine.getCellValue('sheet1', 1, 3)).toBe(40)

      engine.setCell('sheet1', 2, 3, '=SMALL(A1:A5, 2)')
      expect(engine.getCellValue('sheet1', 2, 3)).toBe(20)
    })
  })

  describe('Logical Functions', () => {
    it('evaluates IF with true and false branches', () => {
      engine.setCell('sheet1', 0, 0, 85)
      engine.setCell('sheet1', 0, 1, '=IF(A1>=50, "PASS", "FAIL")')
      expect(engine.getCellValue('sheet1', 0, 1)).toBe('PASS')

      engine.setCell('sheet1', 0, 0, 40)
      expect(engine.getCellValue('sheet1', 0, 1)).toBe('FAIL')
    })

    it('evaluates AND, OR, NOT, IFERROR', () => {
      engine.setCell('sheet1', 0, 0, '=AND(5 > 2, 10 < 20)')
      expect(engine.getCellValue('sheet1', 0, 0)).toBe(true)

      engine.setCell('sheet1', 1, 0, '=OR(5 < 2, 10 = 10)')
      expect(engine.getCellValue('sheet1', 1, 0)).toBe(true)

      engine.setCell('sheet1', 2, 0, '=NOT(TRUE())')
      expect(engine.getCellValue('sheet1', 2, 0)).toBe(false)

      engine.setCell('sheet1', 3, 0, '=IFERROR(10/0, "Division error")')
      expect(engine.getCellValue('sheet1', 3, 0)).toBe('Division error')
    })
  })

  describe('Lookup and Reference Functions', () => {
    beforeEach(() => {
      // Table in A1:C4
      // 101, "Alice", 95
      // 102, "Bob",   80
      // 103, "Charlie", 88
      // 104, "David", 92
      const data = [
        [101, 'Alice', 95],
        [102, 'Bob', 80],
        [103, 'Charlie', 88],
        [104, 'David', 92],
      ]
      data.forEach((row, r) => {
        row.forEach((val, c) => {
          engine.setCell('sheet1', r, c, val)
        })
      })
    })

    it('evaluates VLOOKUP exact match', () => {
      engine.setCell('sheet1', 5, 0, '=VLOOKUP(102, A1:C4, 2, FALSE())')
      expect(engine.getCellValue('sheet1', 5, 0)).toBe('Bob')

      engine.setCell('sheet1', 6, 0, '=VLOOKUP(103, A1:C4, 3, FALSE())')
      expect(engine.getCellValue('sheet1', 6, 0)).toBe(88)
    })

    it('evaluates INDEX and MATCH', () => {
      engine.setCell('sheet1', 7, 0, '=MATCH("Charlie", B1:B4, 0)')
      expect(engine.getCellValue('sheet1', 7, 0)).toBe(3)

      engine.setCell('sheet1', 8, 0, '=INDEX(C1:C4, MATCH("Charlie", B1:B4, 0))')
      expect(engine.getCellValue('sheet1', 8, 0)).toBe(88)
    })
  })

  describe('Text Functions', () => {
    it('evaluates UPPER, LOWER, PROPER, CONCATENATE, LEN, LEFT, RIGHT, MID', () => {
      engine.setCell('sheet1', 0, 0, 'hello world')
      engine.setCell('sheet1', 1, 0, '=UPPER(A1)')
      expect(engine.getCellValue('sheet1', 1, 0)).toBe('HELLO WORLD')

      engine.setCell('sheet1', 2, 0, '=PROPER(A1)')
      expect(engine.getCellValue('sheet1', 2, 0)).toBe('Hello World')

      engine.setCell('sheet1', 3, 0, '=LEN(A1)')
      expect(engine.getCellValue('sheet1', 3, 0)).toBe(11)

      engine.setCell('sheet1', 4, 0, '=LEFT(A1, 5)')
      expect(engine.getCellValue('sheet1', 4, 0)).toBe('hello')

      engine.setCell('sheet1', 5, 0, '=RIGHT(A1, 5)')
      expect(engine.getCellValue('sheet1', 5, 0)).toBe('world')

      engine.setCell('sheet1', 6, 0, '=MID(A1, 7, 5)')
      expect(engine.getCellValue('sheet1', 6, 0)).toBe('world')

      engine.setCell('sheet1', 7, 0, '=CONCATENATE("Z", "Office", " ", "Sheets")')
      expect(engine.getCellValue('sheet1', 7, 0)).toBe('ZOffice Sheets')
    })

    it('evaluates TRIM, REPLACE, SUBSTITUTE', () => {
      engine.setCell('sheet1', 0, 1, '  spaces  ')
      engine.setCell('sheet1', 1, 1, '=TRIM(B1)')
      expect(engine.getCellValue('sheet1', 1, 1)).toBe('spaces')

      engine.setCell('sheet1', 2, 1, '=SUBSTITUTE("banana", "a", "o")')
      expect(engine.getCellValue('sheet1', 2, 1)).toBe('bonono')
    })
  })

  describe('Date & Time Functions', () => {
    it('evaluates DATE, YEAR, MONTH, DAY', () => {
      engine.setCell('sheet1', 0, 0, '=DATE(2026, 10, 23)')
      engine.setCell('sheet1', 1, 0, '=YEAR(A1)')
      expect(engine.getCellValue('sheet1', 1, 0)).toBe(2026)

      engine.setCell('sheet1', 2, 0, '=MONTH(A1)')
      expect(engine.getCellValue('sheet1', 2, 0)).toBe(10)

      engine.setCell('sheet1', 3, 0, '=DAY(A1)')
      expect(engine.getCellValue('sheet1', 3, 0)).toBe(23)
    })
  })

  describe('Cross-Sheet References', () => {
    it('references cells from another sheet', () => {
      engine.ensureSheet('sheet2', 'Sheet2')
      engine.setCell('sheet2', 0, 0, 42) // Sheet2!A1 = 42

      engine.setCell('sheet1', 0, 0, '=Sheet2!A1 * 2')
      expect(engine.getCellValue('sheet1', 0, 0)).toBe(84)

      // Update value in sheet2
      engine.setCell('sheet2', 0, 0, 100)
      expect(engine.getCellValue('sheet1', 0, 0)).toBe(200)
    })
  })
})
