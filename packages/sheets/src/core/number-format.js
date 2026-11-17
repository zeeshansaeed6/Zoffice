/**
 * Cell number formatting for display. Stored values stay untouched.
 * @typedef {'general'|'number'|'integer'|'currency'|'percent'} NumberFormat
 */

export const NUMBER_FORMATS = ['general', 'number', 'integer', 'currency', 'percent']

export const DEFAULT_DECIMALS = { number: 2, integer: 0, currency: 2, percent: 2 }

const group = (n, decimals) =>
  n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })

/**
 * Formats a numeric value for display, or returns null when no formatting applies.
 *
 * @param {any} value - Computed cell value
 * @param {NumberFormat} [format='general']
 * @param {number} [decimals] - Overrides the default decimals of the format
 * @returns {string|null}
 */
export function formatNumber(value, format = 'general', decimals) {
  if (format === 'general' || typeof value !== 'number' || !Number.isFinite(value)) return null
  const places = decimals ?? DEFAULT_DECIMALS[format]
  if (format === 'currency') {
    return `${value < 0 ? '-' : ''}$${group(Math.abs(value), places)}`
  }
  if (format === 'percent') return `${group(value * 100, places)}%`
  return group(value, places)
}
