/**
 * @typedef {Object} RecoverableDocument
 * @property {string} id
 * @property {string} title
 * @property {string} appId
 * @property {string|null} filePath
 * @property {string} content
 * @property {number} timestamp
 */

/**
 * Check if any crash-recovery documents are stored on disk.
 * @returns {Promise<RecoverableDocument[]>}
 */
export async function getRecoverableDocuments() {
  if (typeof window !== 'undefined' && window.zofficeAPI?.autosave?.list) {
    try {
      return await window.zofficeAPI.autosave.list()
    } catch (err) {
      console.error('[Recovery] Failed to list recovery files:', err)
      return []
    }
  }
  return []
}

/**
 * Remove an autosave recovery document once restored or dismissed.
 * @param {string} id
 * @returns {Promise<boolean>}
 */
export async function clearRecoveryDocument(id) {
  if (typeof window !== 'undefined' && window.zofficeAPI?.autosave?.remove) {
    try {
      await window.zofficeAPI.autosave.remove(id)
      return true
    } catch (err) {
      console.error('[Recovery] Failed to remove recovery file:', err)
      return false
    }
  }
  return false
}
