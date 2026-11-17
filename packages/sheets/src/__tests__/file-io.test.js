import { describe, it, expect } from 'vitest'
import JSZip from 'jszip'
import { createWorkbook, createSheet, setCell, getCell } from '../core/sheet-model.js'
import { recalcWorkbook } from '../core/recalc.js'
import { updateActiveSheet, applyStyle, applyNumberFormat } from '../core/sheet-ops.js'
import { workbookToXlsxBase64, xlsxToWorkbook } from '../core/xlsx-io.js'
import { parseCsv, csvToWorkbook, sheetToCsv } from '../core/csv-io.js'

describe('ZSheets file formats', () => {
  it('round-trips values, formulas, styles, sizes and multiple sheets through .xlsx', async () => {
    let wb = createWorkbook('Data')
    wb.sheets.push(createSheet('s2', 'Notes'))
    wb = updateActiveSheet(wb, (s) => {
      setCell(s, 0, 0, 'Item & <Co>')
      setCell(s, 0, 1, 12.5)
      setCell(s, 1, 1, '=B1*2')
      applyStyle(
        s,
        { startRow: 0, startCol: 0, endRow: 0, endCol: 0 },
        { bold: true, bgColor: '#fef08a', align: 'center' },
      )
      applyNumberFormat(s, { startRow: 1, startCol: 1, endRow: 1, endCol: 1 }, 'currency')
      s.colWidths[0] = 140
    })
    wb = recalcWorkbook(wb)

    const base64 = await workbookToXlsxBase64(wb)
    const zip = await JSZip.loadAsync(base64, { base64: true })
    expect(Object.keys(zip.files)).toContain('xl/worksheets/sheet2.xml')

    const back = recalcWorkbook(await xlsxToWorkbook(base64))
    expect(back.sheets.map((s) => s.name)).toEqual(['Data', 'Notes'])
    const sheet = back.sheets[0]
    expect(getCell(sheet, 0, 0)).toMatchObject({
      raw: 'Item & <Co>',
      style: { bold: true, bgColor: '#fef08a', align: 'center' },
    })
    expect(getCell(sheet, 1, 1)).toMatchObject({
      raw: '=B1*2',
      value: 25,
      numFmt: 'currency',
      display: '$25.00',
    })
    expect(sheet.colWidths[0]).toBe(140)
  })

  it('reads shared strings and booleans from a hand-written package', async () => {
    const zip = new JSZip()
    zip.file(
      'xl/workbook.xml',
      '<workbook xmlns:r="x"><sheets><sheet name="S" sheetId="1" r:id="rId1"/></sheets></workbook>',
    )
    zip.file(
      'xl/_rels/workbook.xml.rels',
      '<Relationships><Relationship Id="rId1" Target="worksheets/sheet1.xml"/></Relationships>',
    )
    zip.file(
      'xl/sharedStrings.xml',
      '<sst><si><t>Hello</t></si><si><r><t>Rich </t></r><r><t>text</t></r></si></sst>',
    )
    zip.file(
      'xl/worksheets/sheet1.xml',
      '<worksheet><sheetData><row r="1"><c r="A1" t="s"><v>0</v></c><c r="B1" t="s"><v>1</v></c><c r="C1" t="b"><v>1</v></c><c r="D1"><v>7</v></c></row></sheetData></worksheet>',
    )
    const wb = await xlsxToWorkbook(await zip.generateAsync({ type: 'base64' }))
    const s = wb.sheets[0]
    expect([
      getCell(s, 0, 0).raw,
      getCell(s, 0, 1).raw,
      getCell(s, 0, 2).raw,
      getCell(s, 0, 3).value,
    ]).toEqual(['Hello', 'Rich text', 'TRUE', 7])
  })

  it('rejects a package without a workbook part', async () => {
    const zip = new JSZip()
    zip.file('hello.txt', 'x')
    await expect(xlsxToWorkbook(await zip.generateAsync({ type: 'base64' }))).rejects.toThrow(
      /Invalid .xlsx/,
    )
  })

  it('parses and writes CSV with quotes, commas and newlines', () => {
    const text = 'a,"b,1","say ""hi"""\r\n1,2,"two\nlines"\r\n'
    expect(parseCsv(text)).toEqual([
      ['a', 'b,1', 'say "hi"'],
      ['1', '2', 'two\nlines'],
    ])
    const wb = recalcWorkbook(csvToWorkbook(text))
    expect(sheetToCsv(wb.sheets[0])).toBe('a,"b,1","say ""hi"""\r\n1,2,"two\nlines"')
  })
})
