import { createWorkbook, setCell } from './sheet-model.js'

/**
 * Parses RFC 4180 CSV text (quoted fields, escaped quotes, embedded newlines).
 * @param {string} text
 * @returns {string[][]}
 */
export function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let quoted = false
  const pushField = () => {
    row.push(field)
    field = ''
  }
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"'
        i++
      } else if (ch === '"') quoted = false
      else field += ch
    } else if (ch === '"') quoted = true
    else if (ch === ',') pushField()
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++
      pushField()
      rows.push(row)
      row = []
    } else field += ch
  }
  if (field !== '' || row.length > 0) {
    pushField()
    rows.push(row)
  }
  return rows
}

/** Builds a one-sheet workbook from CSV text. */
export function csvToWorkbook(text) {
  const workbook = createWorkbook('Sheet1')
  const sheet = workbook.sheets[0]
  parseCsv(text).forEach((fields, r) =>
    fields.forEach((value, c) => {
      if (value !== '') setCell(sheet, r, c, value)
    }),
  )
  return workbook
}

const quote = (v) => (/[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)

/** Serializes the active sheet as CSV using displayed values. */
export function sheetToCsv(sheet) {
  const rows = Object.keys(sheet.data || {}).map(Number)
  const lastRow = Math.max(-1, ...rows)
  const lastCol = Math.max(-1, ...rows.flatMap((r) => Object.keys(sheet.data[r]).map(Number)))
  const lines = []
  for (let r = 0; r <= lastRow; r++) {
    const fields = []
    for (let c = 0; c <= lastCol; c++) {
      const cell = sheet.data[r]?.[c]
      fields.push(quote(cell ? String(cell.display ?? cell.value ?? cell.raw ?? '') : ''))
    }
    lines.push(fields.join(','))
  }
  return lines.join('\r\n')
}
