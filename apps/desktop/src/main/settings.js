import { getDatabase } from './db.js'

/**
 * Get setting value from SQLite.
 * @param {string} key
 * @returns {unknown}
 */
export function getSetting(key) {
  if (typeof key !== 'string' || !key.trim()) return undefined
  const db = getDatabase()
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key)
  if (!row) return undefined
  try {
    return JSON.parse(row.value)
  } catch {
    return row.value
  }
}

/**
 * Persist setting value to SQLite.
 * @param {string} key
 * @param {unknown} value
 * @returns {boolean}
 */
export function setSetting(key, value) {
  if (typeof key !== 'string' || !key.trim()) return false
  const db = getDatabase()
  const serialized = JSON.stringify(value)
  const stmt = db.prepare(`
    INSERT INTO settings (key, value, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET
      value = excluded.value,
      updated_at = excluded.updated_at
  `)
  stmt.run(key, serialized, Date.now())
  return true
}
