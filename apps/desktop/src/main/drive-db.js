import { getDatabase } from './db.js'

/**
 * Ensures drive tables exist in SQLite database.
 */
export function ensureDriveTables() {
  const db = getDatabase()
  db.exec(`
    CREATE TABLE IF NOT EXISTS drive_items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      kind TEXT NOT NULL,
      parent_id TEXT,
      data_json TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `)
}

/**
 * Retrieve all saved drive items.
 * @returns {any[]}
 */
export function getAllDriveItems() {
  ensureDriveTables()
  const db = getDatabase()
  const rows = db.prepare('SELECT data_json FROM drive_items ORDER BY updated_at DESC').all()
  return rows.map((r) => JSON.parse(r.data_json))
}

/**
 * Retrieve a single drive item by ID.
 * @param {string} id
 * @returns {any|null}
 */
export function getDriveItemById(id) {
  ensureDriveTables()
  const db = getDatabase()
  const row = db.prepare('SELECT data_json FROM drive_items WHERE id = ?').get(id)
  return row ? JSON.parse(row.data_json) : null
}

/**
 * Save collection of drive items in transaction.
 * @param {any[]} items
 */
export function saveDriveItems(items = []) {
  ensureDriveTables()
  const db = getDatabase()
  const now = Date.now()

  const insertStmt = db.prepare(
    `INSERT INTO drive_items (id, name, kind, parent_id, data_json, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       name = excluded.name,
       kind = excluded.kind,
       parent_id = excluded.parent_id,
       data_json = excluded.data_json,
       updated_at = excluded.updated_at`,
  )

  const transaction = db.transaction((itemList) => {
    for (const item of itemList) {
      insertStmt.run(
        item.id,
        item.name || 'Untitled',
        item.kind || 'other',
        item.parentId || null,
        JSON.stringify(item),
        item.createdAt || now,
        now,
      )
    }
  })

  transaction(items)
}

/**
 * Delete a drive item by ID.
 * @param {string} id
 */
export function deleteDriveItem(id) {
  ensureDriveTables()
  const db = getDatabase()
  db.prepare('DELETE FROM drive_items WHERE id = ?').run(id)
}
