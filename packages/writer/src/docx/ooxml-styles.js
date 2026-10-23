import {
  parseXml,
  getChildElements,
  getFirstChildElement,
  getAttribute,
  halfPointsToPixels,
} from './xml-utils.js'

/**
 * Parses word/styles.xml into a styles dictionary and defaults.
 *
 * @param {string|null} stylesXml
 * @returns {{
 *   defaults: { fontFamily: string, fontSize: string, color: string|null },
 *   styles: Map<string, {
 *     id: string,
 *     name: string,
 *     type: string,
 *     basedOn: string|null,
 *     rPr: Record<string, any>,
 *     pPr: Record<string, any>
 *   }>
 * }}
 */
export function parseStyles(stylesXml) {
  const defaults = {
    fontFamily: 'Inter',
    fontSize: '16px',
    color: null,
  }
  const styles = new Map()

  if (!stylesXml) return { defaults, styles }

  try {
    const doc = parseXml(stylesXml)
    const stylesEl = doc.documentElement

    // 1. Parse docDefaults
    const docDefaultsEl = getFirstChildElement(stylesEl, 'docDefaults')
    if (docDefaultsEl) {
      const rPrDef = getFirstChildElement(docDefaultsEl, 'rPrDefault')
      if (rPrDef) {
        const rPr = getFirstChildElement(rPrDef, 'rPr')
        if (rPr) {
          const fontEl = getFirstChildElement(rPr, 'rFonts')
          if (fontEl) {
            defaults.fontFamily =
              getAttribute(fontEl, 'ascii') || getAttribute(fontEl, 'hAnsi') || defaults.fontFamily
          }
          const szEl = getFirstChildElement(rPr, 'sz')
          if (szEl) {
            const szVal = getAttribute(szEl, 'val')
            if (szVal) defaults.fontSize = `${halfPointsToPixels(szVal)}px`
          }
          const colorEl = getFirstChildElement(rPr, 'color')
          if (colorEl) {
            const cVal = getAttribute(colorEl, 'val')
            if (cVal && cVal !== 'auto') defaults.color = `#${cVal}`
          }
        }
      }
    }

    // 2. Parse individual w:style entries
    const styleEls = getChildElements(stylesEl, 'style')
    for (const sEl of styleEls) {
      const id = getAttribute(sEl, 'styleId') || ''
      const type = getAttribute(sEl, 'type') || 'paragraph'
      const nameEl = getFirstChildElement(sEl, 'name')
      const name = nameEl ? getAttribute(nameEl, 'val') || id : id

      const basedOnEl = getFirstChildElement(sEl, 'basedOn')
      const basedOn = basedOnEl ? getAttribute(basedOnEl, 'val') : null

      const rPrEl = getFirstChildElement(sEl, 'rPr')
      const rPr = rPrEl ? parseRunProperties(rPrEl) : {}

      const pPrEl = getFirstChildElement(sEl, 'pPr')
      const pPr = pPrEl ? parseParagraphProperties(pPrEl) : {}

      styles.set(id, { id, name, type, basedOn, rPr, pPr })
    }
  } catch (err) {
    console.warn('[ooxml-styles] Failed to parse styles.xml:', err)
  }

  return { defaults, styles }
}

/**
 * Extracts formatting from a w:rPr element.
 * @param {Element} rPrEl
 * @returns {Record<string, any>}
 */
export function parseRunProperties(rPrEl) {
  const props = {}

  // Bold
  if (getFirstChildElement(rPrEl, 'b')) {
    const bEl = getFirstChildElement(rPrEl, 'b')
    const val = getAttribute(bEl, 'val')
    props.bold = val === null || val === '1' || val === 'true'
  }

  // Italic
  if (getFirstChildElement(rPrEl, 'i')) {
    const iEl = getFirstChildElement(rPrEl, 'i')
    const val = getAttribute(iEl, 'val')
    props.italic = val === null || val === '1' || val === 'true'
  }

  // Underline
  if (getFirstChildElement(rPrEl, 'u')) {
    const uEl = getFirstChildElement(rPrEl, 'u')
    const val = getAttribute(uEl, 'val')
    props.underline = val !== 'none'
  }

  // Strike
  if (getFirstChildElement(rPrEl, 'strike')) {
    const sEl = getFirstChildElement(rPrEl, 'strike')
    const val = getAttribute(sEl, 'val')
    props.strike = val === null || val === '1' || val === 'true'
  }

  // Subscript / Superscript
  const vertAlignEl = getFirstChildElement(rPrEl, 'vertAlign')
  if (vertAlignEl) {
    const v = getAttribute(vertAlignEl, 'val')
    if (v === 'subscript') props.subscript = true
    if (v === 'superscript') props.superscript = true
  }

  // Font family
  const fontsEl = getFirstChildElement(rPrEl, 'rFonts')
  if (fontsEl) {
    const font =
      getAttribute(fontsEl, 'ascii') ||
      getAttribute(fontsEl, 'hAnsi') ||
      getAttribute(fontsEl, 'cs')
    if (font) props.fontFamily = font
  }

  // Font size
  const szEl = getFirstChildElement(rPrEl, 'sz')
  if (szEl) {
    const val = getAttribute(szEl, 'val')
    if (val) props.fontSize = `${halfPointsToPixels(val)}px`
  }

  // Color
  const colorEl = getFirstChildElement(rPrEl, 'color')
  if (colorEl) {
    const val = getAttribute(colorEl, 'val')
    if (val && val !== 'auto') props.color = `#${val}`
  }

  // Highlight
  const hlEl = getFirstChildElement(rPrEl, 'highlight')
  if (hlEl) {
    const val = getAttribute(hlEl, 'val')
    if (val && val !== 'none') props.highlight = val
  }

  // Small caps
  if (getFirstChildElement(rPrEl, 'smallCaps')) {
    props.smallCaps = true
  }

  return props
}

/**
 * Extracts formatting from a w:pPr element.
 * @param {Element} pPrEl
 * @returns {Record<string, any>}
 */
export function parseParagraphProperties(pPrEl) {
  const props = {}

  // Alignment
  const jcEl = getFirstChildElement(pPrEl, 'jc')
  if (jcEl) {
    const val = getAttribute(jcEl, 'val')
    if (val === 'center') props.align = 'center'
    else if (val === 'right') props.align = 'right'
    else if (val === 'both' || val === 'justify') props.align = 'justify'
    else props.align = 'left'
  }

  // Spacing (line spacing and margins)
  const spEl = getFirstChildElement(pPrEl, 'spacing')
  if (spEl) {
    const line = getAttribute(spEl, 'line')
    if (line) {
      const lineNum = parseFloat(line)
      if (lineNum > 0) {
        // Line spacing is usually in 240ths of a line (e.g. 240 = 1.0, 360 = 1.5, 480 = 2.0)
        props.lineSpacing = (lineNum / 240).toFixed(2)
      }
    }
  }

  // Keep with next
  if (getFirstChildElement(pPrEl, 'keepNext')) {
    props.keepNext = true
  }

  return props
}

/**
 * Resolves combined formatting for a style, following its basedOn inheritance chain.
 *
 * @param {string|null} styleId
 * @param {Map<string, any>} styles
 * @param {any} defaults
 * @returns {{ rPr: Record<string, any>, pPr: Record<string, any> }}
 */
export function resolveStyle(styleId, styles, defaults) {
  const resolved = {
    rPr: { fontFamily: defaults.fontFamily, fontSize: defaults.fontSize },
    pPr: {},
  }

  if (!styleId || !styles.has(styleId)) return resolved

  // Collect inheritance chain (from top ancestor down to target style)
  const chain = []
  let current = styleId
  const visited = new Set()

  while (current && styles.has(current) && !visited.has(current)) {
    visited.add(current)
    chain.unshift(styles.get(current))
    current = styles.get(current).basedOn
  }

  for (const style of chain) {
    Object.assign(resolved.rPr, style.rPr)
    Object.assign(resolved.pPr, style.pPr)
  }

  return resolved
}
