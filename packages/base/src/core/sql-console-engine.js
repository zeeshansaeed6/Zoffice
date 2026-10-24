/**
 * ZBase SQL Console Engine — in-memory SQL execution over base tables.
 * Supports SELECT, WHERE (=, !=, >, <, >=, <=, LIKE), ORDER BY, and LIMIT.
 * @module sql-console-engine
 */

/**
 * @typedef {Object} SqlQueryResult
 * @property {boolean} success
 * @property {string[]} [columns]
 * @property {Array<Record<string, any>>} [rows]
 * @property {number} [rowCount]
 * @property {string} [error]
 */

/**
 * Execute an in-memory SQL query against a collection of base tables.
 *
 * @param {string} query - SQL query string
 * @param {import('./base-model.js').BaseTable[]} tables - Available tables
 * @returns {SqlQueryResult}
 */
export function executeSqlQuery(query = '', tables = []) {
  if (!query || typeof query !== 'string' || !query.trim()) {
    return { success: false, error: 'Empty query provided' }
  }

  const cleanQuery = query.trim().replace(/;+$/, '')

  // Basic SQL regex parser for SELECT ... FROM ... [WHERE ...] [ORDER BY ...] [LIMIT ...]
  const selectMatch = cleanQuery.match(
    /^SELECT\s+(.+?)\s+FROM\s+([a-zA-Z0-9_\-"' ]+?)(?:\s+WHERE\s+(.+?))?(?:\s+ORDER\s+BY\s+(.+?))?(?:\s+LIMIT\s+(\d+))?$/i,
  )

  if (!selectMatch) {
    return {
      success: false,
      error:
        'Syntax error: Only "SELECT ... FROM ... [WHERE ...] [ORDER BY ...] [LIMIT ...]" is supported.',
    }
  }

  const [, rawColumns, rawTableName, rawWhere, rawOrderBy, rawLimit] = selectMatch
  const tableName = rawTableName.trim().replace(/^["'`]|["'`]$/g, '')

  // Find target table
  const table = tables.find(
    (t) =>
      t.name.toLowerCase() === tableName.toLowerCase() ||
      t.id.toLowerCase() === tableName.toLowerCase(),
  )

  if (!table) {
    const available = tables.map((t) => `"${t.name}"`).join(', ')
    return {
      success: false,
      error: `Table "${tableName}" not found. Available tables: ${available || 'none'}`,
    }
  }

  // Create field lookup maps (by name and id)
  const fieldByName = new Map()
  const fieldById = new Map()
  for (const f of table.fields) {
    fieldByName.set(f.name.toLowerCase(), f)
    fieldById.set(f.id, f)
  }

  // Determine requested columns
  let selectedFields = []
  if (rawColumns.trim() === '*') {
    selectedFields = [...table.fields]
  } else {
    const colNames = splitSqlIdentifiers(rawColumns)
    for (const name of colNames) {
      const cleanName = name.trim().replace(/^["'`]|["'`]$/g, '')
      const field = fieldByName.get(cleanName.toLowerCase()) || fieldById.get(cleanName)
      if (field) {
        selectedFields.push(field)
      } else {
        return {
          success: false,
          error: `Column "${cleanName}" does not exist in table "${table.name}".`,
        }
      }
    }
  }

  // Filter records with WHERE clause if present
  let resultRecords = [...table.records]
  if (rawWhere) {
    try {
      resultRecords = resultRecords.filter((rec) =>
        evaluateWhereCondition(rawWhere, rec, fieldByName, fieldById),
      )
    } catch (err) {
      return { success: false, error: `WHERE error: ${err.message}` }
    }
  }

  // Sort records with ORDER BY clause if present
  if (rawOrderBy) {
    resultRecords = applyOrderBy(rawOrderBy, resultRecords, fieldByName, fieldById)
  }

  // Apply LIMIT
  if (rawLimit) {
    const limitNum = parseInt(rawLimit, 10)
    if (!isNaN(limitNum) && limitNum >= 0) {
      resultRecords = resultRecords.slice(0, limitNum)
    }
  }

  // Project output rows
  const columns = selectedFields.map((f) => f.name)
  const rows = resultRecords.map((rec) => {
    const rowObj = { _id: rec.id }
    for (const f of selectedFields) {
      rowObj[f.name] = rec.fields[f.id] ?? null
    }
    return rowObj
  })

  return {
    success: true,
    columns,
    rows,
    rowCount: rows.length,
  }
}

/**
 * Split comma-separated SQL column identifiers safely.
 * @param {string} str
 * @returns {string[]}
 */
function splitSqlIdentifiers(str) {
  const parts = []
  let current = ''
  let inQuote = false
  let quoteChar = ''

  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    if ((char === '"' || char === "'") && (!inQuote || quoteChar === char)) {
      inQuote = !inQuote
      quoteChar = inQuote ? char : ''
      current += char
    } else if (char === ',' && !inQuote) {
      parts.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  if (current.trim()) parts.push(current.trim())
  return parts
}

/**
 * Evaluate WHERE condition for a single record.
 * @param {string} whereClause
 * @param {import('./base-model.js').TableRecord} record
 * @param {Map<string, any>} fieldByName
 * @param {Map<string, any>} fieldById
 * @returns {boolean}
 */
function evaluateWhereCondition(whereClause, record, fieldByName, fieldById) {
  // Support basic binary operators: =, !=, <>, >=, <=, >, <, LIKE
  const match = whereClause.match(/^\s*(.+?)\s*(=|!=|<>|>=|<=|>|<|LIKE|like)\s*(.+?)\s*$/i)

  if (!match) {
    throw new Error(`Unsupported WHERE clause syntax: "${whereClause}"`)
  }

  const [, leftToken, operator, rightToken] = match
  const colName = leftToken.trim().replace(/^["'`]|["'`]$/g, '')
  const field = fieldByName.get(colName.toLowerCase()) || fieldById.get(colName)

  if (!field) {
    throw new Error(`Unknown column "${colName}" in WHERE condition`)
  }

  const recordValue = record.fields[field.id]
  const targetValue = parseSqlLiteral(rightToken.trim())

  const op = operator.toUpperCase()

  if (op === '=' || op === '==') {
    return String(recordValue).toLowerCase() === String(targetValue).toLowerCase()
  }
  if (op === '!=' || op === '<>') {
    return String(recordValue).toLowerCase() !== String(targetValue).toLowerCase()
  }
  if (op === '>') {
    return Number(recordValue) > Number(targetValue)
  }
  if (op === '<') {
    return Number(recordValue) < Number(targetValue)
  }
  if (op === '>=') {
    return Number(recordValue) >= Number(targetValue)
  }
  if (op === '<=') {
    return Number(recordValue) <= Number(targetValue)
  }
  if (op === 'LIKE') {
    const pattern = String(targetValue)
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/%/g, '.*')
      .replace(/_/g, '.')
    const regex = new RegExp(`^${pattern}$`, 'i')
    return regex.test(String(recordValue ?? ''))
  }

  return true
}

/**
 * Parse literal value from SQL text (strings with quotes, numbers, booleans, null).
 * @param {string} token
 * @returns {any}
 */
function parseSqlLiteral(token) {
  if (/^['"].*['"]$/.test(token)) {
    return token.slice(1, -1)
  }
  if (/^(true|false)$/i.test(token)) {
    return token.toLowerCase() === 'true'
  }
  if (/^null$/i.test(token)) {
    return null
  }
  const num = Number(token)
  if (!isNaN(num)) return num
  return token
}

/**
 * Sort records according to ORDER BY clause.
 * @param {string} orderByClause
 * @param {import('./base-model.js').TableRecord[]} records
 * @param {Map<string, any>} fieldByName
 * @param {Map<string, any>} fieldById
 * @returns {import('./base-model.js').TableRecord[]}
 */
function applyOrderBy(orderByClause, records, fieldByName, fieldById) {
  const match = orderByClause.trim().match(/^(.+?)(?:\s+(ASC|DESC))?$/i)
  if (!match) return records

  const colName = match[1].trim().replace(/^["'`]|["'`]$/g, '')
  const direction = (match[2] || 'ASC').toUpperCase() === 'DESC' ? -1 : 1

  const field = fieldByName.get(colName.toLowerCase()) || fieldById.get(colName)
  if (!field) return records

  return [...records].sort((a, b) => {
    const valA = a.fields[field.id] ?? ''
    const valB = b.fields[field.id] ?? ''

    if (typeof valA === 'number' && typeof valB === 'number') {
      return (valA - valB) * direction
    }
    return String(valA).localeCompare(String(valB)) * direction
  })
}
