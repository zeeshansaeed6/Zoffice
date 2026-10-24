import { getDatabase } from './db.js'

/**
 * Ensures planner tables exist in SQLite database.
 */
export function ensurePlannerTables() {
  const db = getDatabase()
  db.exec(`
    CREATE TABLE IF NOT EXISTS planner_boards (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      data_json TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `)
}

/**
 * Retrieve all saved boards.
 * @returns {any[]}
 */
export function getAllBoards() {
  ensurePlannerTables()
  const db = getDatabase()
  const rows = db.prepare('SELECT data_json FROM planner_boards ORDER BY updated_at DESC').all()
  return rows.map((r) => JSON.parse(r.data_json))
}

/**
 * Retrieve a single board by ID.
 * @param {string} id
 * @returns {any|null}
 */
export function getBoardById(id) {
  ensurePlannerTables()
  const db = getDatabase()
  const row = db.prepare('SELECT data_json FROM planner_boards WHERE id = ?').get(id)
  return row ? JSON.parse(row.data_json) : null
}

/**
 * Save or update a board.
 * @param {any} board
 */
export function saveBoard(board) {
  ensurePlannerTables()
  const db = getDatabase()
  const now = Date.now()
  const dataJson = JSON.stringify(board)

  db.prepare(
    `INSERT INTO planner_boards (id, title, description, data_json, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       title = excluded.title,
       description = excluded.description,
       data_json = excluded.data_json,
       updated_at = excluded.updated_at`,
  ).run(
    board.id,
    board.title || 'Untitled Board',
    board.description || '',
    dataJson,
    board.createdAt || now,
    now,
  )
}

/**
 * Delete a board by ID.
 * @param {string} id
 */
export function deleteBoard(id) {
  ensurePlannerTables()
  const db = getDatabase()
  db.prepare('DELETE FROM planner_boards WHERE id = ?').run(id)
}
