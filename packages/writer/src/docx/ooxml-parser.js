import mammoth from 'mammoth'
import { readDocxPackage } from './ooxml-package.js'
import { parseStyles, resolveStyle } from './ooxml-styles.js'
import { parseNumbering, resolveNumbering } from './ooxml-numbering.js'
import { parsePageSetup } from './ooxml-page-setup.js'
import { convertParagraphToHtml, convertTableToHtml } from './ooxml-elements.js'
import { parseXml, getChildElements, getFirstChildElement } from './xml-utils.js'

/**
 * Parses an OOXML document (.docx) directly with high-fidelity formatting preservation.
 * Falls back to mammoth only if direct OOXML parsing fails.
 *
 * @param {string|Buffer|Uint8Array|ArrayBuffer} input
 * @returns {Promise<{
 *   html: string,
 *   pageSetup: any,
 *   stats: { runCount: number, tableCount: number, imageCount: number, listCount: number },
 *   preservedFiles: Map<string, any>,
 *   isDirect: boolean
 * }>}
 */
export async function parseDocxDirect(input) {
  try {
    const pkg = await readDocxPackage(input)
    const { defaults, styles } = parseStyles(pkg.stylesXml)
    const numberingMap = parseNumbering(pkg.numberingXml)

    const doc = parseXml(pkg.documentXml)
    const body = getFirstChildElement(doc.documentElement, 'body')
    if (!body) throw new Error('Missing w:body in document.xml')

    const pageSetup = parsePageSetup(doc.documentElement)

    const context = {
      relationships: pkg.relationships,
      media: pkg.media,
      defaults,
      styles,
      resolveStyle: (id) => resolveStyle(id, styles, defaults),
      resolveNumbering: (numId, ilvl) => resolveNumbering(numId, ilvl, numberingMap),
    }

    const stats = {
      runCount: 0,
      tableCount: 0,
      imageCount: pkg.media.size,
      listCount: 0,
    }

    let html = ''
    let activeList = null // { type: 'ul'|'ol', level: number }

    const closeActiveList = () => {
      if (activeList) {
        html += activeList.type === 'ul' ? '</ul>' : '</ol>'
        activeList = null
      }
    }

    for (let i = 0; i < body.childNodes.length; i++) {
      const node = body.childNodes[i]
      if (node.nodeType !== 1) continue
      const el = /** @type {Element} */ (node)
      const local = el.localName || el.nodeName.split(':').pop()

      if (local === 'p') {
        const pResult = convertParagraphToHtml(el, context)
        stats.runCount += getChildElements(el, 'r').length

        if (pResult.isList) {
          stats.listCount++
          const listType = pResult.listInfo.isOrdered ? 'ol' : 'ul'

          if (!activeList || activeList.type !== listType) {
            closeActiveList()
            html +=
              listType === 'ul'
                ? '<ul class="list-disc pl-6 my-2">'
                : '<ol class="list-decimal pl-6 my-2">'
            activeList = { type: listType, level: pResult.listInfo.level }
          }
          html += pResult.html
        } else {
          closeActiveList()
          html += pResult.html
        }
      } else if (local === 'tbl') {
        closeActiveList()
        html += convertTableToHtml(el, context)
        stats.tableCount++
      }
    }

    closeActiveList()

    return {
      html,
      pageSetup,
      stats,
      preservedFiles: pkg.preservedFiles,
      isDirect: true,
    }
  } catch (err) {
    console.warn('[ooxml-parser] Direct OOXML parse failed, falling back to mammoth:', err)
    return parseWithMammothFallback(input)
  }
}

/**
 * Fallback parser using mammoth if direct OOXML parsing encounters an issue.
 *
 * @param {string|Buffer|Uint8Array|ArrayBuffer} input
 * @returns {Promise<any>}
 */
async function parseWithMammothFallback(input) {
  let buffer = input
  if (typeof input === 'string') {
    const cleanBase64 = input.replace(/^data:.*?;base64,/, '').trim()
    buffer = Buffer.from(cleanBase64, 'base64')
  }

  const { value: html } = await mammoth.convertToHtml({ buffer })
  return {
    html: html || '<p></p>',
    pageSetup: {
      pageSize: 'a4',
      orientation: 'portrait',
      margins: { top: 96, bottom: 96, left: 96, right: 96 },
    },
    stats: { runCount: 0, tableCount: 0, imageCount: 0, listCount: 0 },
    preservedFiles: new Map(),
    isDirect: false,
  }
}
