import { parseXml, getChildElements, getFirstChildElement, getAttribute } from './xml-utils.js'

/**
 * Parses word/numbering.xml to map list instances to bullet or ordered formats.
 *
 * @param {string|null} numberingXml
 * @returns {Map<string, { abstractNumId: string, levels: Map<number, { isBullet: boolean, numFmt: string }> }>}
 */
export function parseNumbering(numberingXml) {
  const result = new Map()
  if (!numberingXml) return result

  try {
    const doc = parseXml(numberingXml)
    const root = doc.documentElement

    // 1. Parse abstractNum definitions
    const abstractMap = new Map()
    const abstractEls = getChildElements(root, 'abstractNum')

    for (const absEl of abstractEls) {
      const absId = getAttribute(absEl, 'abstractNumId') || ''
      const levels = new Map()

      const lvlEls = getChildElements(absEl, 'lvl')
      for (const lvlEl of lvlEls) {
        const ilvl = parseInt(getAttribute(lvlEl, 'ilvl') || '0', 10)
        const numFmtEl = getFirstChildElement(lvlEl, 'numFmt')
        const numFmt = numFmtEl ? getAttribute(numFmtEl, 'val') || 'decimal' : 'decimal'
        const isBullet = numFmt === 'bullet'

        levels.set(ilvl, { isBullet, numFmt })
      }
      abstractMap.set(absId, levels)
    }

    // 2. Parse num elements (concrete list instances)
    const numEls = getChildElements(root, 'num')
    for (const numEl of numEls) {
      const numId = getAttribute(numEl, 'numId') || ''
      const absRefEl = getFirstChildElement(numEl, 'abstractNumId')
      const abstractNumId = absRefEl ? getAttribute(absRefEl, 'val') || '' : ''

      const levels = abstractMap.get(abstractNumId) || new Map()
      result.set(numId, { abstractNumId, levels })
    }
  } catch (err) {
    console.warn('[ooxml-numbering] Failed to parse numbering.xml:', err)
  }

  return result
}

/**
 * Resolves whether a paragraph with w:numPr is a bullet list or ordered list.
 *
 * @param {string|null} numId
 * @param {number|string|null} ilvl
 * @param {Map<string, any>} numberingMap
 * @returns {{ isBullet: boolean, isOrdered: boolean, level: number }}
 */
export function resolveNumbering(numId, ilvl, numberingMap) {
  const levelNum = typeof ilvl === 'number' ? ilvl : parseInt(ilvl || '0', 10) || 0

  if (!numId || !numberingMap.has(numId)) {
    return { isBullet: true, isOrdered: false, level: levelNum }
  }

  const numDef = numberingMap.get(numId)
  const lvlDef = numDef.levels.get(levelNum)

  if (!lvlDef) {
    return { isBullet: true, isOrdered: false, level: levelNum }
  }

  return {
    isBullet: lvlDef.isBullet,
    isOrdered: !lvlDef.isBullet,
    level: levelNum,
  }
}
