/**
 * Parses an XML string into a DOM Document.
 * Supports browser DOMParser and Node.js environments via jsdom.
 *
 * @param {string} xmlString
 * @returns {Document}
 */
export function parseXml(xmlString) {
  if (typeof DOMParser !== 'undefined') {
    return new DOMParser().parseFromString(xmlString, 'text/xml')
  }

  // Node.js fallback using jsdom
  try {
    const nodeRequire = eval('require')
    const { JSDOM } = nodeRequire('jsdom')
    return new new JSDOM().window.DOMParser().parseFromString(xmlString, 'text/xml')
  } catch {
    throw new Error('No XML DOMParser available in current environment')
  }
}

/**
 * Gets direct child elements matching a local tag name (ignoring namespace prefixes).
 *
 * @param {Element|Document} parent
 * @param {string} localName - e.g. 'p', 'r', 'tbl', 't'
 * @returns {Element[]}
 */
export function getChildElements(parent, localName) {
  if (!parent || !parent.childNodes) return []
  const matches = []
  const target = localName.toLowerCase()

  for (let i = 0; i < parent.childNodes.length; i++) {
    const node = parent.childNodes[i]
    if (node.nodeType === 1) {
      // Node.ELEMENT_NODE
      const nodeLocal = node.localName || node.nodeName.split(':').pop()
      if (nodeLocal.toLowerCase() === target) {
        matches.push(/** @type {Element} */ (node))
      }
    }
  }
  return matches
}

/**
 * Gets the first direct child element matching a local tag name.
 *
 * @param {Element|Document} parent
 * @param {string} localName
 * @returns {Element|null}
 */
export function getFirstChildElement(parent, localName) {
  const children = getChildElements(parent, localName)
  return children.length > 0 ? children[0] : null
}

/**
 * Gets an attribute value from an element, trying direct attribute and 'w:' prefixed attribute.
 *
 * @param {Element} element
 * @param {string} attrName - e.g. 'val', 'w:val', 'id', 'r:id'
 * @returns {string|null}
 */
export function getAttribute(element, attrName) {
  if (!element || !element.getAttribute) return null

  // Direct match
  if (element.hasAttribute(attrName)) {
    return element.getAttribute(attrName)
  }

  // Strip prefix or try with 'w:' or 'r:'
  const nameOnly = attrName.includes(':') ? attrName.split(':').pop() : attrName
  if (nameOnly && element.hasAttribute(nameOnly)) {
    return element.getAttribute(nameOnly)
  }
  if (nameOnly && element.hasAttribute(`w:${nameOnly}`)) {
    return element.getAttribute(`w:${nameOnly}`)
  }
  if (nameOnly && element.hasAttribute(`r:${nameOnly}`)) {
    return element.getAttribute(`r:${nameOnly}`)
  }

  return null
}

/**
 * Converts OOXML twips (twentieths of a point) to CSS pixels at 96 DPI.
 * 1 in = 1440 twips = 96 px -> px = twips * 96 / 1440 = twips / 15.
 *
 * @param {number|string} twips
 * @returns {number}
 */
export function twipsToPixels(twips) {
  const num = typeof twips === 'number' ? twips : parseFloat(twips)
  if (Number.isNaN(num)) return 0
  return Math.round((num * 96) / 1440)
}

/**
 * Converts OOXML half-points (w:sz) to CSS pixels.
 * e.g. 24 half-points = 12 pt = 16 px at 96 DPI (1 pt = 4/3 px).
 *
 * @param {number|string} halfPoints
 * @returns {number}
 */
export function halfPointsToPixels(halfPoints) {
  const num = typeof halfPoints === 'number' ? halfPoints : parseFloat(halfPoints)
  if (Number.isNaN(num)) return 16
  const points = num / 2
  return Math.round((points * 96) / 72)
}

/**
 * Converts OOXML EMUs (English Metric Units) to CSS pixels.
 * 1 inch = 914,400 EMUs = 96 pixels -> px = emus * 96 / 914400.
 *
 * @param {number|string} emus
 * @returns {number}
 */
export function emusToPixels(emus) {
  const num = typeof emus === 'number' ? emus : parseFloat(emus)
  if (Number.isNaN(num)) return 0
  return Math.round((num * 96) / 914400)
}
