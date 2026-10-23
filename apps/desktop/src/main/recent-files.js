import { getDatabase } from './db.js'

/**
 * Retrieve recent files ordered by last_opened descending.
 * @param {number} [limit=20]
 * @returns {Array<{ id: number, filePath: string, title: string, appId: string, lastOpened: number }>}
 */
export function getRecentFiles(limit = 20) {
  const safeLimit = Math.max(1, Math.min(100, Number(limit) || 20))
  const db = getDatabase()
  const rows = db
    .prepare(
      `SELECT id, file_path as filePath, title, app_id as appId, last_opened as lastOpened
       FROM recent_files
       ORDER BY last_opened DESC
       LIMIT ?`,
    )
    .all(safeLimit)
  return rows
}

/**
 * Insert or touch a recent file.
 * @param {Object} item
 * @param {string} item.filePath
 * @param {string} item.title
 * @param {string} item.appId
 */
export function addRecentFile({ filePath, title, appId }) {
  if (!filePath || typeof filePath !== 'string') return
  const db = getDatabase()
  const now = Date.now()
  const stmt = db.prepare(`
    INSERT INTO recent_files (file_path, title, app_id, last_opened)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(file_path) DO UPDATE SET
      title = excluded.title,
      app_id = excluded.app_id,
      last_opened = excluded.last_opened
  `)
  stmt.run(filePath, title || 'Untitled', appId || 'writer', now)
}

/**
 * Clear all recent files history.
 */
export function clearRecentFiles() {
  const db = getDatabase()
  db.prepare('DELETE FROM recent_files').run()
}
