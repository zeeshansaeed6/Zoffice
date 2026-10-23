import { getChildElements, getFirstChildElement, getAttribute, emusToPixels } from './xml-utils.js'
import { parseRunProperties, parseParagraphProperties } from './ooxml-styles.js'

/**
 * Converts an OOXML w:r (run) element into semantic HTML with inline styling.
 *
 * @param {Element} rEl
 * @param {Object} context
 * @returns {string}
 */
export function convertRunToHtml(rEl, context) {
  const rPrEl = getFirstChildElement(rEl, 'rPr')
  const directRPr = rPrEl ? parseRunProperties(rPrEl) : {}
  const rPr = { ...(context.defaultRPr || {}), ...directRPr }

  // 1. Process drawings / images inside the run
  const drawingEl = getFirstChildElement(rEl, 'drawing')
  if (drawingEl) {
    const imgHtml = convertDrawingToHtml(drawingEl, context)
    if (imgHtml) return imgHtml
  }

  // 2. Process page break inside run
  const brEls = getChildElements(rEl, 'br')
  for (const br of brEls) {
    if (getAttribute(br, 'type') === 'page') {
      return '<div data-type="page-break" class="page-break"></div>'
    }
  }

  // 3. Extract text content
  let text = ''
  for (let i = 0; i < rEl.childNodes.length; i++) {
    const node = rEl.childNodes[i]
    if (node.nodeType === 1) {
      const el = /** @type {Element} */ (node)
      const local = el.localName || el.nodeName.split(':').pop()
      if (local === 't') {
        text += el.textContent || ''
      } else if (local === 'tab') {
        text += '    '
      } else if (local === 'br') {
        text += '<br/>'
      }
    }
  }

  if (!text) return ''

  // Escape HTML characters in text
  let content = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

  // Apply typography marks
  if (rPr.bold) content = `<strong>${content}</strong>`
  if (rPr.italic) content = `<em>${content}</em>`
  if (rPr.underline) content = `<u>${content}</u>`
  if (rPr.strike) content = `<s>${content}</s>`
  if (rPr.subscript) content = `<sub>${content}</sub>`
  if (rPr.superscript) content = `<sup>${content}</sup>`

  // Inline CSS styles
  const styles = []
  if (rPr.fontFamily) styles.push(`font-family: '${rPr.fontFamily}', sans-serif`)
  if (rPr.fontSize) styles.push(`font-size: ${rPr.fontSize}`)
  if (rPr.color) styles.push(`color: ${rPr.color}`)
  if (rPr.highlight) {
    const hlMap = {
      yellow: '#fef08a',
      green: '#bbf7d0',
      cyan: '#a5f3fc',
      magenta: '#fbcfe8',
      red: '#fecaca',
    }
    const bg = hlMap[rPr.highlight] || rPr.highlight
    styles.push(`background-color: ${bg}`)
  }
  if (rPr.smallCaps) styles.push('font-variant: small-caps')

  if (styles.length > 0) {
    return `<span style="${styles.join('; ')}">${content}</span>`
  }

  return content
}

/**
 * Converts w:drawing into <img> tag with base64 data URI and pixel dimensions.
 *
 * @param {Element} drawingEl
 * @param {Object} context
 * @returns {string}
 */
export function convertDrawingToHtml(drawingEl, context) {
  // Find a:blip
  const blipEls = drawingEl.getElementsByTagNameNS('*', 'blip')
  const blipEl = blipEls.length > 0 ? blipEls[0] : null
  if (!blipEl) return ''

  const rId =
    getAttribute(blipEl, 'embed') ||
    getAttribute(blipEl, 'r:embed') ||
    blipEl.getAttribute('r:embed')
  if (!rId) return ''

  const rel = context.relationships?.get(rId)
  const target = rel ? rel.target : ''
  const dataUri = context.media?.get(target) || context.media?.get(target.split('/').pop() || '')
  if (!dataUri) return ''

  // Dimensions from wp:extent
  let widthAttr = ''
  let heightAttr = ''
  const extentEls = drawingEl.getElementsByTagNameNS('*', 'extent')
  if (extentEls.length > 0) {
    const cx = getAttribute(extentEls[0], 'cx')
    const cy = getAttribute(extentEls[0], 'cy')
    if (cx) widthAttr = ` width="${emusToPixels(cx)}"`
    if (cy) heightAttr = ` height="${emusToPixels(cy)}"`
  }

  return `<img src="${dataUri}"${widthAttr}${heightAttr} class="inline-block max-w-full rounded" />`
}

/**
 * Converts an OOXML w:p (paragraph) into HTML.
 *
 * @param {Element} pEl
 * @param {Object} context
 * @returns {{ html: string, isList: boolean, listInfo: any }}
 */
export function convertParagraphToHtml(pEl, context) {
  const pPrEl = getFirstChildElement(pEl, 'pPr')
  const directPPr = pPrEl ? parseParagraphProperties(pPrEl) : {}

  // Determine style
  let styleId = null
  if (pPrEl) {
    const pStyleEl = getFirstChildElement(pPrEl, 'pStyle')
    if (pStyleEl) styleId = getAttribute(pStyleEl, 'val')
  }

  // Resolve style inheritance
  const inherited = context.resolveStyle ? context.resolveStyle(styleId) : { rPr: {}, pPr: {} }
  const mergedPPr = { ...inherited.pPr, ...directPPr }
  const defaultRPr = { ...inherited.rPr }

  // Child runs & hyperlinks
  let innerHtml = ''
  for (let i = 0; i < pEl.childNodes.length; i++) {
    const node = pEl.childNodes[i]
    if (node.nodeType === 1) {
      const el = /** @type {Element} */ (node)
      const local = el.localName || el.nodeName.split(':').pop()
      if (local === 'r') {
        innerHtml += convertRunToHtml(el, { ...context, defaultRPr })
      } else if (local === 'hyperlink') {
        const rId = getAttribute(el, 'id') || getAttribute(el, 'r:id')
        const rel = rId ? context.relationships?.get(rId) : null
        const href = rel ? rel.target : '#'
        const linkRuns = getChildElements(el, 'r')
        const linkText = linkRuns
          .map((r) => convertRunToHtml(r, { ...context, defaultRPr }))
          .join('')
        innerHtml += `<a href="${href}" class="text-blue-600 underline">${linkText}</a>`
      }
    }
  }

  // Check list item (w:numPr)
  let listInfo = null
  if (pPrEl) {
    const numPrEl = getFirstChildElement(pPrEl, 'numPr')
    if (numPrEl) {
      const numIdEl = getFirstChildElement(numPrEl, 'numId')
      const ilvlEl = getFirstChildElement(numPrEl, 'ilvl')
      const numId = numIdEl ? getAttribute(numIdEl, 'val') : null
      const ilvl = ilvlEl ? getAttribute(ilvlEl, 'val') : '0'

      if (context.resolveNumbering) {
        listInfo = context.resolveNumbering(numId, ilvl)
      } else {
        listInfo = { isBullet: true, isOrdered: false, level: 0 }
      }
    }
  }

  if (listInfo) {
    return {
      html: `<li>${innerHtml || '<br/>'}</li>`,
      isList: true,
      listInfo,
    }
  }

  // Map heading styles or blockquote
  const normStyle = (styleId || '').toLowerCase().replace(/[^a-z0-9]/g, '')
  let tag = 'p'
  if (normStyle === 'heading1' || normStyle === 'title') tag = 'h1'
  else if (normStyle === 'heading2') tag = 'h2'
  else if (normStyle === 'heading3') tag = 'h3'
  else if (normStyle === 'heading4') tag = 'h4'
  else if (normStyle === 'heading5') tag = 'h5'
  else if (normStyle === 'heading6') tag = 'h6'
  else if (normStyle === 'quote') tag = 'blockquote'

  // Inline CSS
  const styles = []
  if (mergedPPr.align) styles.push(`text-align: ${mergedPPr.align}`)
  if (mergedPPr.lineSpacing) styles.push(`line-height: ${mergedPPr.lineSpacing}`)

  const styleAttr = styles.length > 0 ? ` style="${styles.join('; ')}"` : ''
  return {
    html: `<${tag}${styleAttr}>${innerHtml || '<br/>'}</${tag}>`,
    isList: false,
    listInfo: null,
  }
}

/**
 * Converts an OOXML w:tbl (table) into HTML.
 *
 * @param {Element} tblEl
 * @param {Object} context
 * @returns {string}
 */
export function convertTableToHtml(tblEl, context) {
  let tableHtml = '<table class="w-full border-collapse border border-neutral-300 my-4">'
  const rows = getChildElements(tblEl, 'tr')

  for (const row of rows) {
    tableHtml += '<tr>'
    const cells = getChildElements(row, 'tc')

    for (const cell of cells) {
      const tcPr = getFirstChildElement(cell, 'tcPr')
      const attrs = []
      const cellStyles = ['border: 1px solid #d4d4d8', 'padding: 6px 10px']

      if (tcPr) {
        // Colspan (gridSpan)
        const gridSpanEl = getFirstChildElement(tcPr, 'gridSpan')
        if (gridSpanEl) {
          const span = getAttribute(gridSpanEl, 'val')
          if (span) attrs.push(`colspan="${span}"`)
        }

        // Shading / Background color
        const shdEl = getFirstChildElement(tcPr, 'shd')
        if (shdEl) {
          const fill = getAttribute(shdEl, 'fill')
          if (fill && fill !== 'auto') cellStyles.push(`background-color: #${fill}`)
        }
      }

      // Convert paragraphs inside the cell
      const cellPars = getChildElements(cell, 'p')
      const cellContent = cellPars.map((p) => convertParagraphToHtml(p, context).html).join('')

      const styleStr = cellStyles.length > 0 ? ` style="${cellStyles.join('; ')}"` : ''
      tableHtml += `<td ${attrs.join(' ')}${styleStr}>${cellContent || '<br/>'}</td>`
    }
    tableHtml += '</tr>'
  }

  tableHtml += '</table>'
  return tableHtml
}
