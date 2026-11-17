/**
 * Cell style <-> OOXML styles.xml mapping for the xlsx reader/writer.
 * ZSheets styles: { bold, italic, align, bgColor, textColor } plus cell.numFmt/decimals.
 */

const NUM_FMT_IDS = { general: 0, number: 4, integer: 1, percent: 10 }
const CURRENCY_ID = 164
const CURRENCY_CODE = '&quot;$&quot;#,##0.00'
const ID_TO_FMT = { 1: 'integer', 4: 'number', 10: 'percent', 164: 'currency' }

const esc = (v) =>
  String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
const rgb = (hex) => `FF${hex.replace('#', '').toUpperCase()}`
const hex = (argb) => `#${argb.slice(-6).toLowerCase()}`

/** Collects unique style combinations and builds styles.xml. */
export function createStyleRegistry() {
  const fonts = ['<font><sz val="11"/><name val="Calibri"/></font>']
  const fills = [
    '<fill><patternFill patternType="none"/></fill>',
    '<fill><patternFill patternType="gray125"/></fill>',
  ]
  const xfs = ['<xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>']
  const index = new Map()
  const intern = (list, xml) => {
    const i = list.indexOf(xml)
    if (i >= 0) return i
    list.push(xml)
    return list.length - 1
  }

  return {
    /** @returns {number} xf index for a cell (0 = default) */
    idFor(cell) {
      const st = cell.style || {}
      const fmt = cell.numFmt || 'general'
      if (
        !st.bold &&
        !st.italic &&
        !st.align &&
        !st.bgColor &&
        !st.textColor &&
        fmt === 'general'
      ) {
        return 0
      }
      const key = JSON.stringify([st, fmt])
      if (index.has(key)) return index.get(key)
      const font = `<font>${st.bold ? '<b/>' : ''}${st.italic ? '<i/>' : ''}<sz val="11"/>${
        st.textColor ? `<color rgb="${rgb(st.textColor)}"/>` : ''
      }<name val="Calibri"/></font>`
      const fill = st.bgColor
        ? `<fill><patternFill patternType="solid"><fgColor rgb="${rgb(st.bgColor)}"/></patternFill></fill>`
        : fills[0]
      const numFmtId = fmt === 'currency' ? CURRENCY_ID : NUM_FMT_IDS[fmt] || 0
      const align = st.align ? `<alignment horizontal="${st.align}"/>` : ''
      const xf = `<xf numFmtId="${numFmtId}" fontId="${intern(fonts, font)}" fillId="${intern(fills, fill)}" borderId="0" applyFont="1" applyFill="1" applyNumberFormat="1"${align ? ' applyAlignment="1">' + align + '</xf>' : '/>'}`
      xfs.push(xf)
      index.set(key, xfs.length - 1)
      return xfs.length - 1
    },
    toXml() {
      return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
        `<numFmts count="1"><numFmt numFmtId="${CURRENCY_ID}" formatCode="${CURRENCY_CODE}"/></numFmts>` +
        `<fonts count="${fonts.length}">${fonts.join('')}</fonts>` +
        `<fills count="${fills.length}">${fills.join('')}</fills>` +
        '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>' +
        '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
        `<cellXfs count="${xfs.length}">${xfs.join('')}</cellXfs>` +
        '</styleSheet>'
      )
    },
  }
}

/**
 * Parses styles.xml into a function mapping an xf index to ZSheets style fields.
 * @param {string|null} stylesXml
 * @returns {(xfIndex: number) => { style?: Object, numFmt?: string }}
 */
export function readStyles(stylesXml) {
  if (!stylesXml) return () => ({})
  const doc = new DOMParser().parseFromString(stylesXml, 'application/xml')
  const custom = new Map()
  for (const el of doc.getElementsByTagName('numFmt')) {
    const code = el.getAttribute('formatCode') || ''
    if (/\$|€|£/.test(code)) custom.set(Number(el.getAttribute('numFmtId')), 'currency')
    else if (code.includes('%')) custom.set(Number(el.getAttribute('numFmtId')), 'percent')
    else if (/^#,##0(\.0+)?$/.test(code)) custom.set(Number(el.getAttribute('numFmtId')), 'number')
  }
  const fonts = Array.from(doc.getElementsByTagName('font')).map((f) => ({
    bold: !!f.getElementsByTagName('b')[0],
    italic: !!f.getElementsByTagName('i')[0],
    textColor: f.getElementsByTagName('color')[0]?.getAttribute('rgb') || null,
  }))
  const fills = Array.from(doc.getElementsByTagName('fill')).map((f) =>
    f.getElementsByTagName('patternFill')[0]?.getAttribute('patternType') === 'solid'
      ? f.getElementsByTagName('fgColor')[0]?.getAttribute('rgb') || null
      : null,
  )
  const xfEls = doc.getElementsByTagName('cellXfs')[0]?.getElementsByTagName('xf') || []
  const xfs = Array.from(xfEls)

  return (xfIndex) => {
    const xf = xfs[xfIndex]
    if (!xf) return {}
    const font = fonts[Number(xf.getAttribute('fontId'))] || {}
    const fill = fills[Number(xf.getAttribute('fillId'))]
    const style = {}
    if (font.bold) style.bold = true
    if (font.italic) style.italic = true
    if (font.textColor && font.textColor.length === 8) style.textColor = hex(font.textColor)
    if (fill && fill.length === 8) style.bgColor = hex(fill)
    const horizontal = xf.getElementsByTagName('alignment')[0]?.getAttribute('horizontal')
    if (['left', 'center', 'right'].includes(horizontal)) style.align = horizontal
    const id = Number(xf.getAttribute('numFmtId'))
    const numFmt = custom.get(id) || ID_TO_FMT[id]
    return { ...(Object.keys(style).length ? { style } : {}), ...(numFmt ? { numFmt } : {}) }
  }
}

export { esc }
