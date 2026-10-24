import { getDatabase } from './db.js'

/**
 * Ensures form and response tables exist in SQLite.
 */
export function ensureFormsTables() {
  const db = getDatabase()
  db.exec(`
    CREATE TABLE IF NOT EXISTS forms (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      theme_color TEXT NOT NULL DEFAULT '#4f46e5',
      accept_responses INTEGER NOT NULL DEFAULT 1,
      allow_multiple INTEGER NOT NULL DEFAULT 1,
      data_json TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS form_responses (
      id TEXT PRIMARY KEY,
      form_id TEXT NOT NULL,
      answers_json TEXT NOT NULL,
      submitted_at INTEGER NOT NULL,
      FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_form_responses_form ON form_responses(form_id);
  `)
}

/**
 * Retrieve all saved forms.
 * @returns {any[]}
 */
export function getAllForms() {
  ensureFormsTables()
  const db = getDatabase()
  const rows = db.prepare('SELECT data_json FROM forms ORDER BY updated_at DESC').all()
  return rows.map((r) => JSON.parse(r.data_json))
}

/**
 * Retrieve a single form by ID.
 * @param {string} id
 * @returns {any|null}
 */
export function getFormById(id) {
  ensureFormsTables()
  const db = getDatabase()
  const row = db.prepare('SELECT data_json FROM forms WHERE id = ?').get(id)
  return row ? JSON.parse(row.data_json) : null
}

/**
 * Save or update a form schema.
 * @param {any} form
 */
export function saveForm(form) {
  ensureFormsTables()
  const db = getDatabase()
  const now = Date.now()
  const dataJson = JSON.stringify(form)

  db.prepare(
    `INSERT INTO forms (id, title, description, theme_color, accept_responses, allow_multiple, data_json, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       title = excluded.title,
       description = excluded.description,
       theme_color = excluded.theme_color,
       accept_responses = excluded.accept_responses,
       allow_multiple = excluded.allow_multiple,
       data_json = excluded.data_json,
       updated_at = excluded.updated_at`,
  ).run(
    form.id,
    form.title || 'Untitled Form',
    form.description || '',
    form.themeColor || '#4f46e5',
    form.acceptResponses ? 1 : 0,
    form.allowMultiple ? 1 : 0,
    dataJson,
    form.createdAt || now,
    now,
  )
}

/**
 * Delete a form by ID.
 * @param {string} id
 */
export function deleteForm(id) {
  ensureFormsTables()
  const db = getDatabase()
  db.prepare('DELETE FROM forms WHERE id = ?').run(id)
}

/**
 * Retrieve all responses for a form.
 * @param {string} formId
 * @returns {any[]}
 */
export function getFormResponses(formId) {
  ensureFormsTables()
  const db = getDatabase()
  const rows = db
    .prepare(
      'SELECT id, form_id, answers_json, submitted_at FROM form_responses WHERE form_id = ? ORDER BY submitted_at DESC',
    )
    .all(formId)

  return rows.map((r) => ({
    id: r.id,
    formId: r.form_id,
    answers: JSON.parse(r.answers_json),
    submittedAt: r.submitted_at,
  }))
}

/**
 * Save a form submission response.
 * @param {any} response
 */
export function saveResponse(response) {
  ensureFormsTables()
  const db = getDatabase()
  const answersJson = JSON.stringify(response.answers || {})

  db.prepare(
    `INSERT INTO form_responses (id, form_id, answers_json, submitted_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       answers_json = excluded.answers_json,
       submitted_at = excluded.submitted_at`,
  ).run(response.id, response.formId, answersJson, response.submittedAt || Date.now())
}

/**
 * Delete a single response by ID.
 * @param {string} id
 */
export function deleteResponse(id) {
  ensureFormsTables()
  const db = getDatabase()
  db.prepare('DELETE FROM form_responses WHERE id = ?').run(id)
}

/**
 * Clear all responses for a form.
 * @param {string} formId
 */
export function clearFormResponses(formId) {
  ensureFormsTables()
  const db = getDatabase()
  db.prepare('DELETE FROM form_responses WHERE form_id = ?').run(formId)
}
