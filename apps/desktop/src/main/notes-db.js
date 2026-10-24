import { getDatabase } from './db.js'

/**
 * Ensures note tables exist in SQLite.
 */
export function ensureNotesTables() {
  const db = getDatabase()
  db.exec(`
    CREATE TABLE IF NOT EXISTS notes_notebooks (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notes_sections (
      id TEXT PRIMARY KEY,
      notebook_id TEXT NOT NULL,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      order_idx INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (notebook_id) REFERENCES notes_notebooks(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notes_pages (
      id TEXT PRIMARY KEY,
      section_id TEXT NOT NULL,
      title TEXT NOT NULL,
      tags TEXT NOT NULL DEFAULT '[]',
      order_idx INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (section_id) REFERENCES notes_sections(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notes_blocks (
      id TEXT PRIMARY KEY,
      page_id TEXT NOT NULL,
      type TEXT NOT NULL,
      content TEXT NOT NULL,
      x REAL NOT NULL DEFAULT 40,
      y REAL NOT NULL DEFAULT 40,
      width REAL NOT NULL DEFAULT 300,
      height REAL NOT NULL DEFAULT 40,
      order_idx INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (page_id) REFERENCES notes_pages(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_notes_sections_nb ON notes_sections(notebook_id);
    CREATE INDEX IF NOT EXISTS idx_notes_pages_sec ON notes_pages(section_id);
    CREATE INDEX IF NOT EXISTS idx_notes_blocks_page ON notes_blocks(page_id);
  `)
}

/**
 * List all notebooks.
 * @returns {Array<any>}
 */
export function listNotebooks() {
  ensureNotesTables()
  const db = getDatabase()
  const rows = db.prepare('SELECT * FROM notes_notebooks ORDER BY updated_at DESC').all()
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    color: r.color,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }))
}

/**
 * Save or update a notebook.
 * @param {Object} nb
 * @returns {boolean}
 */
export function saveNotebook(nb) {
  ensureNotesTables()
  const db = getDatabase()
  const now = Date.now()
  const stmt = db.prepare(`
    INSERT INTO notes_notebooks (id, name, color, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      color = excluded.color,
      updated_at = excluded.updated_at
  `)
  stmt.run(nb.id, nb.name, nb.color || '#3b82f6', nb.createdAt || now, nb.updatedAt || now)
  return true
}

/**
 * Delete a notebook and its sections/pages/blocks.
 * @param {string} id
 * @returns {boolean}
 */
export function deleteNotebook(id) {
  ensureNotesTables()
  const db = getDatabase()
  db.prepare('DELETE FROM notes_notebooks WHERE id = ?').run(id)
  return true
}

/**
 * List sections for a notebook.
 * @param {string} notebookId
 * @returns {Array<any>}
 */
export function listSections(notebookId) {
  ensureNotesTables()
  const db = getDatabase()
  const rows = db
    .prepare(
      'SELECT * FROM notes_sections WHERE notebook_id = ? ORDER BY order_idx ASC, created_at ASC',
    )
    .all(notebookId)
  return rows.map((r) => ({
    id: r.id,
    notebookId: r.notebook_id,
    name: r.name,
    color: r.color,
    order: r.order_idx,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }))
}

/**
 * Save or update a section.
 * @param {Object} sec
 * @returns {boolean}
 */
export function saveSection(sec) {
  ensureNotesTables()
  const db = getDatabase()
  const now = Date.now()
  const stmt = db.prepare(`
    INSERT INTO notes_sections (id, notebook_id, name, color, order_idx, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      color = excluded.color,
      order_idx = excluded.order_idx,
      updated_at = excluded.updated_at
  `)
  stmt.run(
    sec.id,
    sec.notebookId,
    sec.name,
    sec.color || '#dbeafe',
    sec.order || 0,
    sec.createdAt || now,
    sec.updatedAt || now,
  )
  return true
}

/**
 * Delete a section.
 * @param {string} id
 * @returns {boolean}
 */
export function deleteSection(id) {
  ensureNotesTables()
  const db = getDatabase()
  db.prepare('DELETE FROM notes_sections WHERE id = ?').run(id)
  return true
}

/**
 * List pages for a section.
 * @param {string} sectionId
 * @returns {Array<any>}
 */
export function listPages(sectionId) {
  ensureNotesTables()
  const db = getDatabase()
  const rows = db
    .prepare(
      'SELECT * FROM notes_pages WHERE section_id = ? ORDER BY order_idx ASC, created_at ASC',
    )
    .all(sectionId)
  return rows.map((r) => {
    let tags = []
    try {
      tags = JSON.parse(r.tags)
    } catch {
      tags = []
    }
    return {
      id: r.id,
      sectionId: r.section_id,
      title: r.title,
      tags,
      order: r.order_idx,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }
  })
}

/**
 * Save or update a page.
 * @param {Object} pg
 * @returns {boolean}
 */
export function savePage(pg) {
  ensureNotesTables()
  const db = getDatabase()
  const now = Date.now()
  const stmt = db.prepare(`
    INSERT INTO notes_pages (id, section_id, title, tags, order_idx, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      tags = excluded.tags,
      order_idx = excluded.order_idx,
      updated_at = excluded.updated_at
  `)
  stmt.run(
    pg.id,
    pg.sectionId,
    pg.title,
    JSON.stringify(pg.tags || []),
    pg.order || 0,
    pg.createdAt || now,
    pg.updatedAt || now,
  )
  return true
}

/**
 * Delete a page.
 * @param {string} id
 * @returns {boolean}
 */
export function deletePage(id) {
  ensureNotesTables()
  const db = getDatabase()
  db.prepare('DELETE FROM notes_pages WHERE id = ?').run(id)
  return true
}

/**
 * List blocks for a page.
 * @param {string} pageId
 * @returns {Array<any>}
 */
export function listBlocks(pageId) {
  ensureNotesTables()
  const db = getDatabase()
  const rows = db
    .prepare('SELECT * FROM notes_blocks WHERE page_id = ? ORDER BY order_idx ASC, created_at ASC')
    .all(pageId)
  return rows.map((r) => ({
    id: r.id,
    pageId: r.page_id,
    type: r.type,
    content: r.content,
    x: r.x,
    y: r.y,
    width: r.width,
    height: r.height,
    order: r.order_idx,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }))
}

/**
 * Save or update a block.
 * @param {Object} b
 * @returns {boolean}
 */
export function saveBlock(b) {
  ensureNotesTables()
  const db = getDatabase()
  const now = Date.now()
  const stmt = db.prepare(`
    INSERT INTO notes_blocks (id, page_id, type, content, x, y, width, height, order_idx, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      type = excluded.type,
      content = excluded.content,
      x = excluded.x,
      y = excluded.y,
      width = excluded.width,
      height = excluded.height,
      order_idx = excluded.order_idx,
      updated_at = excluded.updated_at
  `)
  stmt.run(
    b.id,
    b.pageId,
    b.type,
    b.content || '',
    b.x || 40,
    b.y || 40,
    b.width || 300,
    b.height || 40,
    b.order || 0,
    b.createdAt || now,
    b.updatedAt || now,
  )
  return true
}

/**
 * Delete a block.
 * @param {string} id
 * @returns {boolean}
 */
export function deleteBlock(id) {
  ensureNotesTables()
  const db = getDatabase()
  db.prepare('DELETE FROM notes_blocks WHERE id = ?').run(id)
  return true
}
