import JSZip from 'jszip'
import { colIndexToLabel, createSheet, setCell, cellIdToCoords } from './sheet-model.js'
import { createStyleRegistry, readStyles, esc } from './xlsx-styles.js'

const NS = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
const REL_NS = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
const XML_HEAD = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'

const cellXml = (ref, cell, styleId) => {
  const s = styleId ? ` s="${styleId}"` : ''
  if (cell.raw === undefined) return `<c r="${ref}"${s}/>`
  const raw = String(cell.raw)
  if (raw.startsWith('=')) {
    const v = cell.value
    const cached =
      typeof v === 'number'
        ? `<v>${v}</v>`
        : typeof v === 'string' && !v.startsWith('#')
          ? `<v>${esc(v)}</v>`
          : ''
    return `<c r="${ref}"${s}${typeof v === 'string' ? ' t="str"' : ''}><f>${esc(raw.slice(1))}</f>${cached}</c>`
  }
  if (typeof cell.value === 'number' || (raw.trim() !== '' && Number.isFinite(Number(raw)))) {
    return `<c r="${ref}"${s}><v>${Number(raw)}</v></c>`
  }
  if (raw === 'TRUE' || raw === 'FALSE')
    return `<c r="${ref}"${s} t="b"><v>${raw === 'TRUE' ? 1 : 0}</v></c>`
  return `<c r="${ref}"${s} t="inlineStr"><is><t xml:space="preserve">${esc(raw)}</t></is></c>`
}

function sheetXml(sheet, styles) {
  const rows = Object.keys(sheet.data || {})
    .map(Number)
    .sort((a, b) => a - b)
    .map((r) => {
      const cols = Object.keys(sheet.data[r])
        .map(Number)
        .sort((a, b) => a - b)
      const ht = sheet.rowHeights?.[r]
      const cells = cols
        .map((c) => {
          const cell = sheet.data[r][c]
          return cellXml(`${colIndexToLabel(c)}${r + 1}`, cell, styles.idFor(cell))
        })
        .join('')
      return `<row r="${r + 1}"${ht ? ` ht="${ht * 0.75}" customHeight="1"` : ''}>${cells}</row>`
    })
    .join('')
  const widths = Object.entries(sheet.colWidths || {})
    .map(
      ([c, w]) =>
        `<col min="${+c + 1}" max="${+c + 1}" width="${(w / 7).toFixed(2)}" customWidth="1"/>`,
    )
    .join('')
  return `${XML_HEAD}<worksheet xmlns="${NS}">${widths ? `<cols>${widths}</cols>` : ''}<sheetData>${rows}</sheetData></worksheet>`
}

/**
 * Serializes a ZSheets workbook into a real .xlsx package (base64).
 * @param {Object} workbook
 * @returns {Promise<string>}
 */
export async function workbookToXlsxBase64(workbook) {
  const zip = new JSZip()
  const styles = createStyleRegistry()
  const sheetFiles = workbook.sheets.map((sheet, i) => {
    zip.file(`xl/worksheets/sheet${i + 1}.xml`, sheetXml(sheet, styles))
    return i + 1
  })

  zip.file(
    '[Content_Types].xml',
    `${XML_HEAD}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${sheetFiles.map((n) => `<Override PartName="/xl/worksheets/sheet${n}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}</Types>`,
  )
  zip.file(
    '_rels/.rels',
    `${XML_HEAD}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${REL_NS}/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
  )
  zip.file(
    'xl/workbook.xml',
    `${XML_HEAD}<workbook xmlns="${NS}" xmlns:r="${REL_NS}"><sheets>${workbook.sheets.map((s, i) => `<sheet name="${esc(s.name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')}</sheets></workbook>`,
  )
  zip.file(
    'xl/_rels/workbook.xml.rels',
    `${XML_HEAD}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${sheetFiles.map((n) => `<Relationship Id="rId${n}" Type="${REL_NS}/worksheet" Target="worksheets/sheet${n}.xml"/>`).join('')}<Relationship Id="rId${sheetFiles.length + 1}" Type="${REL_NS}/styles" Target="styles.xml"/></Relationships>`,
  )
  zip.file('xl/styles.xml', styles.toXml())
  return zip.generateAsync({ type: 'base64', compression: 'DEFLATE' })
}

const textOf = (el) =>
  Array.from(el.getElementsByTagName('t'))
    .map((t) => t.textContent)
    .join('')
const parse = (xml) => new DOMParser().parseFromString(xml, 'application/xml')

/**
 * Reads a .xlsx package (base64 or bytes) into a ZSheets workbook. Values are
 * taken from the file; call recalcWorkbook to recompute formulas.
 * @param {string|Uint8Array|ArrayBuffer} input
 * @returns {Promise<Object>}
 */
export async function xlsxToWorkbook(input) {
  const isBase64 = typeof input === 'string'
  const zip = await JSZip.loadAsync(
    isBase64 ? input.replace(/^data:.*?;base64,/, '').trim() : input,
    {
      base64: isBase64,
    },
  )
  const read = async (path) => (zip.file(path) ? zip.file(path).async('string') : null)

  const workbookXml = await read('xl/workbook.xml')
  if (!workbookXml) throw new Error('Invalid .xlsx: xl/workbook.xml not found')
  const relsXml = (await read('xl/_rels/workbook.xml.rels')) || ''
  const targets = new Map(
    Array.from(parse(relsXml).getElementsByTagName('Relationship')).map((r) => [
      r.getAttribute('Id'),
      r.getAttribute('Target'),
    ]),
  )
  const sharedXml = await read('xl/sharedStrings.xml')
  const shared = sharedXml
    ? Array.from(parse(sharedXml).getElementsByTagName('si')).map(textOf)
    : []
  const styleFor = readStyles(await read('xl/styles.xml'))

  const sheets = []
  for (const el of parse(workbookXml).getElementsByTagName('sheet')) {
    const target = targets.get(el.getAttribute('r:id'))
    const xml = target && (await read(`xl/${target.replace(/^\/?(xl\/)?/, '')}`))
    const sheet = createSheet(
      `sheet_${sheets.length + 1}`,
      el.getAttribute('name') || `Sheet${sheets.length + 1}`,
    )
    if (xml) readSheet(parse(xml), sheet, shared, styleFor)
    sheets.push(sheet)
  }
  if (sheets.length === 0) sheets.push(createSheet('sheet1', 'Sheet1'))
  return { activeSheetId: sheets[0].id, sheets }
}

function readSheet(doc, sheet, shared, styleFor) {
  for (const col of doc.getElementsByTagName('col')) {
    const width = parseFloat(col.getAttribute('width'))
    if (col.getAttribute('customWidth') && width) {
      for (let c = +col.getAttribute('min'); c <= +col.getAttribute('max'); c++) {
        sheet.colWidths[c - 1] = Math.round(width * 7)
      }
    }
  }
  for (const c of doc.getElementsByTagName('c')) {
    const coords = cellIdToCoords(c.getAttribute('r'))
    if (!coords) continue
    const type = c.getAttribute('t')
    const f = c.getElementsByTagName('f')[0]?.textContent
    const v = c.getElementsByTagName('v')[0]?.textContent
    let value
    if (type === 's') value = shared[Number(v)] ?? ''
    else if (type === 'inlineStr') value = textOf(c)
    else if (type === 'b') value = v === '1'
    else if (type === 'str' || type === 'e') value = v ?? ''
    else value = v === undefined || v === null || v === '' ? undefined : Number(v)

    const extras = styleFor(Number(c.getAttribute('s') || 0))
    const raw = f
      ? `=${f}`
      : value === undefined
        ? undefined
        : typeof value === 'boolean'
          ? String(value).toUpperCase()
          : String(value)
    if (raw === undefined && !extras.style && !extras.numFmt) continue
    setCell(sheet, coords.row, coords.col, {
      ...(raw !== undefined ? { raw, value: value ?? raw } : {}),
      ...extras,
    })
  }
}
