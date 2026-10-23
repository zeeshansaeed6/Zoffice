import { listAutosaveDocuments, removeAutosaveDocument } from './autosave.js'

/**
 * Scan for unrecovered session backups.
 * @returns {Array<any>}
 */
export function checkCrashRecovery() {
  const documents = listAutosaveDocuments()
  return documents
}

/**
 * Discard all recovered documents.
 */
export function discardAllRecovery() {
  const documents = listAutosaveDocuments()
  for (const doc of documents) {
    if (doc.id) {
      removeAutosaveDocument(doc.id)
    }
  }
}
