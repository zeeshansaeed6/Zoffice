import { getDatabase } from './db.js'

/**
 * Ensures draw tables exist in SQLite database.
 */
export function ensureDrawTables() {
  const db = getDatabase()
  db.exec(`
    CREATE TABLE IF NOT EXISTS draw_diagrams (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      data_json TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `)
}

/**
 * Retrieve all saved diagrams.
 * @returns {any[]}
 */
export function getAllDiagrams() {
  ensureDrawTables()
  const db = getDatabase()
  const rows = db.prepare('SELECT data_json FROM draw_diagrams ORDER BY updated_at DESC').all()
  return rows.map((r) => JSON.parse(r.data_json))
}

/**
 * Retrieve a single diagram by ID.
 * @param {string} id
 * @returns {any|null}
 */
export function getDiagramById(id) {
  ensureDrawTables()
  const db = getDatabase()
  const row = db.prepare('SELECT data_json FROM draw_diagrams WHERE id = ?').get(id)
  return row ? JSON.parse(row.data_json) : null
}

/**
 * Save or update a diagram.
 * @param {any} diagram
 */
export function saveDiagram(diagram) {
  ensureDrawTables()
  const db = getDatabase()
  const now = Date.now()
  const dataJson = JSON.stringify(diagram)

  db.prepare(
    `INSERT INTO draw_diagrams (id, title, data_json, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       title = excluded.title,
       data_json = excluded.data_json,
       updated_at = excluded.updated_at`,
  ).run(diagram.id, diagram.title || 'Untitled Diagram', dataJson, diagram.createdAt || now, now)
}

/**
 * Delete a diagram by ID.
 * @param {string} id
 */
export function deleteDiagram(id) {
  ensureDrawTables()
  const db = getDatabase()
  db.prepare('DELETE FROM draw_diagrams WHERE id = ?').run(id)
}
