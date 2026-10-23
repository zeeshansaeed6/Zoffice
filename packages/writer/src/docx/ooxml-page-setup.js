import { getChildElements, getFirstChildElement, getAttribute, twipsToPixels } from './xml-utils.js'

/**
 * Extracts page dimensions, orientation, and margins from w:sectPr.
 *
 * @param {Element|Document} root
 * @returns {{
 *   pageSize: 'a4'|'letter'|'custom',
 *   orientation: 'portrait'|'landscape',
 *   margins: { top: number, bottom: number, left: number, right: number },
 *   dimensions: { widthPx: number, heightPx: number }
 * }}
 */
export function parsePageSetup(root) {
  // Default A4 portrait with normal 1in (96px) margins
  const result = {
    pageSize: 'a4',
    orientation: 'portrait',
    margins: { top: 96, bottom: 96, left: 96, right: 96 },
    dimensions: { widthPx: 794, heightPx: 1123 },
  }

  // Find sectPr: either as direct child of body or within last paragraph pPr
  let sectPr = getFirstChildElement(root, 'sectPr')
  if (!sectPr) {
    const body = getFirstChildElement(root, 'body') || root
    sectPr = getFirstChildElement(body, 'sectPr')
    if (!sectPr) {
      const paragraphs = getChildElements(body, 'p')
      for (const p of paragraphs) {
        const pPr = getFirstChildElement(p, 'pPr')
        if (pPr) {
          const pSectPr = getFirstChildElement(pPr, 'sectPr')
          if (pSectPr) sectPr = pSectPr
        }
      }
    }
  }

  if (!sectPr) return result

  // 1. Page Size & Orientation
  const pgSzEl = getFirstChildElement(sectPr, 'pgSz')
  if (pgSzEl) {
    const wTwips = parseFloat(getAttribute(pgSzEl, 'w') || '11906')
    const hTwips = parseFloat(getAttribute(pgSzEl, 'h') || '16838')
    const orient = getAttribute(pgSzEl, 'orient') || 'portrait'

    result.orientation = orient === 'landscape' ? 'landscape' : 'portrait'
    result.dimensions.widthPx = twipsToPixels(wTwips)
    result.dimensions.heightPx = twipsToPixels(hTwips)

    // Detect A4 (11906 x 16838 twips) vs Letter (12240 x 15840 twips)
    if (Math.abs(wTwips - 12240) < 200 || Math.abs(hTwips - 12240) < 200) {
      result.pageSize = 'letter'
    } else {
      result.pageSize = 'a4'
    }
  }

  // 2. Margins
  const pgMarEl = getFirstChildElement(sectPr, 'pgMar')
  if (pgMarEl) {
    const topTwips = getAttribute(pgMarEl, 'top')
    const bottomTwips = getAttribute(pgMarEl, 'bottom')
    const leftTwips = getAttribute(pgMarEl, 'left')
    const rightTwips = getAttribute(pgMarEl, 'right')

    if (topTwips) result.margins.top = twipsToPixels(topTwips)
    if (bottomTwips) result.margins.bottom = twipsToPixels(bottomTwips)
    if (leftTwips) result.margins.left = twipsToPixels(leftTwips)
    if (rightTwips) result.margins.right = twipsToPixels(rightTwips)
  }

  return result
}
