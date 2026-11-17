/**
 * Page dimension and layout utility constants and calculations.
 * Standard desktop print resolution: 96 DPI (dots per inch).
 */

export const PAGE_SIZES = {
  a4: {
    name: 'A4',
    widthPx: 794,
    heightPx: 1123,
    widthMm: 210,
    heightMm: 297,
  },
  letter: {
    name: 'Letter',
    widthPx: 816,
    heightPx: 1056,
    widthIn: 8.5,
    heightIn: 11,
  },
}

export const PAGE_MARGINS = {
  normal: {
    name: 'Normal',
    top: 96,
    bottom: 96,
    left: 96,
    right: 96,
  },
  narrow: {
    name: 'Narrow',
    top: 48,
    bottom: 48,
    left: 48,
    right: 48,
  },
  moderate: {
    name: 'Moderate',
    top: 96,
    bottom: 96,
    left: 72,
    right: 72,
  },
  wide: {
    name: 'Wide',
    top: 96,
    bottom: 96,
    left: 192,
    right: 192,
  },
}

/**
 * Calculates page count from DOM scroll height and single page printable height.
 * @param {number} scrollHeight - Content height in pixels
 * @param {number} pageHeight - Paper page height in pixels
 * @param {number} paddingY - Vertical padding of paper
 * @returns {number}
 */
export function calculatePageCount(scrollHeight, pageHeight = 1123, paddingY = 192) {
  if (!scrollHeight || scrollHeight <= 0) return 1
  const printableHeight = Math.max(200, pageHeight - paddingY)
  return Math.max(1, Math.ceil(scrollHeight / printableHeight))
}

/**
 * Calculates zoom transform scale factor.
 * @param {number} zoomPercent - Zoom level (50 to 200)
 * @returns {number} Scale multiplier (e.g. 1.0 for 100%)
 */
export function getZoomScale(zoomPercent) {
  const safeZoom = Math.min(200, Math.max(50, Number(zoomPercent) || 100))
  return safeZoom / 100
}

/**
 * Resolves a margins setting (preset name or px object) to a px object.
 * @param {string | {top:number,bottom:number,left:number,right:number}} [margins]
 * @returns {{top:number,bottom:number,left:number,right:number}}
 */
export function resolveMargins(margins) {
  if (margins && typeof margins === 'object') return { ...PAGE_MARGINS.normal, ...margins }
  return PAGE_MARGINS[margins] || PAGE_MARGINS.normal
}

/**
 * Computes paper dimensions and margins for a page setup, honoring orientation.
 * @param {{pageSize?: string, orientation?: string, margins?: any}} [setup]
 * @returns {{widthPx:number, heightPx:number, margins:{top:number,bottom:number,left:number,right:number}}}
 */
export function getPageMetrics(setup = {}) {
  const size = PAGE_SIZES[setup.pageSize] || PAGE_SIZES.a4
  const landscape = setup.orientation === 'landscape'
  return {
    widthPx: landscape ? size.heightPx : size.widthPx,
    heightPx: landscape ? size.widthPx : size.heightPx,
    margins: resolveMargins(setup.margins),
  }
}
