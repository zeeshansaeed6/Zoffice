/**
 * ZBase Formula, Lookup, and Rollup Calculation Engine.
 * @module formula-engine
 */

import { ROLLUP_OPERATIONS } from './constants.js'

/**
 * Evaluate a formula expression for a given record.
 * Supports basic arithmetic (+, -, *, /), string concatenation (&), and field substitution {Field Name}.
 *
 * @param {string} formula
 * @param {import('./base-model.js').TableRecord} record
 * @param {import('./base-model.js').TableField[]} fields
 * @returns {any}
 */
export function evaluateFormula(formula = '', record, fields = []) {
  if (!formula || typeof formula !== 'string') return ''

  // Build name-to-value map
  const nameMap = new Map()
  for (const f of fields) {
    const val = record.fields[f.id] ?? ''
    nameMap.set(f.name.toLowerCase(), val)
    nameMap.set(f.id, val)
  }

  // Replace {FieldName} tokens
  let expr = formula.replace(/\{([^}]+)\}/g, (_match, token) => {
    const raw = nameMap.get(token.trim().toLowerCase()) ?? ''
    if (typeof raw === 'number') return String(raw)
    if (typeof raw === 'string') {
      const num = Number(raw)
      return isNaN(num) || raw.trim() === '' ? JSON.stringify(raw) : String(num)
    }
    return JSON.stringify(raw)
  })

  // Handle simple string concatenation (&)
  if (expr.includes('&')) {
    const parts = expr.split('&').map((p) => {
      const trimmed = p.trim()
      try {
        const val = safeEvalArithmetic(trimmed)
        return String(val)
      } catch {
        return trimmed.replace(/^["']|["']$/g, '')
      }
    })
    return parts.join('')
  }

  // Handle arithmetic
  try {
    return safeEvalArithmetic(expr)
  } catch {
    return expr
  }
}

/**
 * Safely evaluate basic math without full eval.
 * Supports numbers and +, -, *, /
 * @param {string} expr
 * @returns {number|string}
 */
function safeEvalArithmetic(expr) {
  const sanitized = expr.replace(/\s+/g, '')
  if (/^[-+/*0-9.()]+$/.test(sanitized)) {
    // eslint-disable-next-line no-new-func
    const result = Function(`'use strict'; return (${sanitized})`)()
    return typeof result === 'number' && !isNaN(result) ? Math.round(result * 100) / 100 : result
  }
  return expr.replace(/^["']|["']$/g, '')
}

/**
 * Resolve a lookup value from a linked table.
 *
 * @param {import('./base-model.js').TableRecord} record
 * @param {import('./base-model.js').TableField} lookupField
 * @param {import('./base-model.js').TableField} linkField
 * @param {import('./base-model.js').BaseTable} linkedTable
 * @returns {any}
 */
export function resolveLookupValue(record, lookupField, linkField, linkedTable) {
  if (!linkedTable || !linkField || !lookupField) return ''
  const linkedRecordId = record.fields[linkField.id]
  if (!linkedRecordId) return ''

  const linkedRecord = linkedTable.records.find((r) => r.id === linkedRecordId)
  if (!linkedRecord) return ''

  return linkedRecord.fields[lookupField.lookupFieldId] ?? ''
}

/**
 * Compute an aggregated rollup value across linked records.
 *
 * @param {import('./base-model.js').TableRecord[]} linkedRecords
 * @param {string} targetFieldId
 * @param {string} [operation=ROLLUP_OPERATIONS.SUM]
 * @returns {number}
 */
export function computeRollupValue(
  linkedRecords = [],
  targetFieldId,
  operation = ROLLUP_OPERATIONS.SUM,
) {
  if (!linkedRecords.length || !targetFieldId) return 0

  const values = linkedRecords
    .map((r) => Number(r.fields[targetFieldId]))
    .filter((n) => !isNaN(n))

  if (operation === ROLLUP_OPERATIONS.COUNT) {
    return values.length
  }

  if (values.length === 0) return 0

  switch (operation) {
    case ROLLUP_OPERATIONS.SUM:
      return Math.round(values.reduce((sum, v) => sum + v, 0) * 100) / 100
    case ROLLUP_OPERATIONS.AVERAGE:
      return Math.round((values.reduce((sum, v) => sum + v, 0) / values.length) * 100) / 100
    case ROLLUP_OPERATIONS.MIN:
      return Math.min(...values)
    case ROLLUP_OPERATIONS.MAX:
      return Math.max(...values)
    default:
      return 0
  }
}
