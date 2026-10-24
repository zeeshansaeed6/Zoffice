import { getDatabase } from './db.js'

/**
 * Ensures base tables exist in SQLite database.
 */
export function ensureBaseTables() {
  const db = getDatabase()
  db.exec(`
    CREATE TABLE IF NOT EXISTS base_databases (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      data_json TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `)
}

/**
 * Retrieve all saved relational bases.
 * @returns {any[]}
 */
export function getAllBases() {
  ensureBaseTables()
  const db = getDatabase()
  const rows = db.prepare('SELECT data_json FROM base_databases ORDER BY updated_at DESC').all()
  return rows.map((r) => JSON.parse(r.data_json))
}

/**
 * Retrieve a single base by ID.
 * @param {string} id
 * @returns {any|null}
 */
export function getBaseById(id) {
  ensureBaseTables()
  const db = getDatabase()
  const row = db.prepare('SELECT data_json FROM base_databases WHERE id = ?').get(id)
  return row ? JSON.parse(row.data_json) : null
}

/**
 * Save or update a relational base.
 * @param {any} base
 */
export function saveBase(base) {
  ensureBaseTables()
  const db = getDatabase()
  const now = Date.now()
  const dataJson = JSON.stringify(base)

  db.prepare(
    `INSERT INTO base_databases (id, title, data_json, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       title = excluded.title,
       data_json = excluded.data_json,
       updated_at = excluded.updated_at`,
  ).run(base.id, base.title || 'Untitled Base', dataJson, base.createdAt || now, now)
}

/**
 * Delete a base by ID.
 * @param {string} id
 */
export function deleteBase(id) {
  ensureBaseTables()
  const db = getDatabase()
  db.prepare('DELETE FROM base_databases WHERE id = ?').run(id)
}
