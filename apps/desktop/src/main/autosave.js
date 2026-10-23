import { app } from 'electron'
import { join } from 'path'
import { mkdirSync, writeFileSync, readdirSync, readFileSync, unlinkSync, existsSync } from 'fs'

/**
 * Returns the autosave storage directory path.
 * @returns {string}
 */
export function getAutosaveDir() {
  const dir = join(app.getPath('userData'), 'autosave')
  mkdirSync(dir, { recursive: true })
  return dir
}

/**
 * Persists document backup snapshot to disk.
 * @param {Object} doc
 * @param {string} doc.id
 * @param {string} doc.title
 * @param {string} doc.appId
 * @param {string|null} doc.filePath
 * @param {string} doc.content
 * @param {number} doc.timestamp
 */
export function saveAutosaveDocument(doc) {
  if (!doc?.id) return
  const dir = getAutosaveDir()
  const safeId = doc.id.replace(/[^a-zA-Z0-9_-]/g, '_')
  const targetFile = join(dir, `${safeId}.json`)
  writeFileSync(targetFile, JSON.stringify(doc), 'utf-8')
}

/**
 * Returns all stored autosave backup documents.
 * @returns {Array<any>}
 */
export function listAutosaveDocuments() {
  const dir = getAutosaveDir()
  const files = readdirSync(dir).filter((f) => f.endsWith('.json'))
  const documents = []
  for (const file of files) {
    try {
      const content = readFileSync(join(dir, file), 'utf-8')
      documents.push(JSON.parse(content))
    } catch {
      // Ignore corrupted autosave files
    }
  }
  return documents
}

/**
 * Deletes an autosave backup document.
 * @param {string} id
 */
export function removeAutosaveDocument(id) {
  if (!id) return
  const dir = getAutosaveDir()
  const safeId = id.replace(/[^a-zA-Z0-9_-]/g, '_')
  const targetFile = join(dir, `${safeId}.json`)
  if (existsSync(targetFile)) {
    unlinkSync(targetFile)
  }
}
