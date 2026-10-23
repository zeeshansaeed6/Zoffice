import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import { mkdirSync } from 'fs'

/** @type {Database.Database | null} */
let dbInstance = null

/**
 * Initializes or returns the singleton SQLite database instance.
 * @returns {Database.Database}
 */
export function getDatabase() {
  if (dbInstance) return dbInstance

  const userDataDir = app.getPath('userData')
  mkdirSync(userDataDir, { recursive: true })
  const dbPath = join(userDataDir, 'zoffice.db')

  dbInstance = new Database(dbPath)
  dbInstance.pragma('journal_mode = WAL')

  // Run schema migrations
  dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS recent_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_path TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      app_id TEXT NOT NULL,
      last_opened INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_recent_files_last_opened 
    ON recent_files(last_opened DESC);
  `)

  return dbInstance
}
