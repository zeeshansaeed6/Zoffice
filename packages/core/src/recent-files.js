/**
 * @typedef {Object} RecentFile
 * @property {number} [id]
 * @property {string} filePath
 * @property {string} title
 * @property {string} appId
 * @property {number} lastOpened
 */

/**
 * Fetch the list of recent files from local SQLite database.
 * @param {number} [limit=20]
 * @returns {Promise<RecentFile[]>}
 */
export async function getRecentFiles(limit = 20) {
  if (typeof window !== 'undefined' && window.zofficeAPI?.recent?.list) {
    try {
      return await window.zofficeAPI.recent.list(limit)
    } catch (err) {
      console.error('[RecentFiles] Failed to load:', err)
      return []
    }
  }
  return []
}

/**
 * Add or touch a recent file entry.
 * @param {Object} item
 * @param {string} item.filePath
 * @param {string} item.title
 * @param {string} item.appId
 * @returns {Promise<boolean>}
 */
export async function addRecentFile(item) {
  if (typeof window !== 'undefined' && window.zofficeAPI?.recent?.add) {
    try {
      await window.zofficeAPI.recent.add(item)
      return true
    } catch (err) {
      console.error('[RecentFiles] Failed to add:', err)
      return false
    }
  }
  return false
}

/**
 * Clear all recent files history.
 * @returns {Promise<boolean>}
 */
export async function clearRecentFiles() {
  if (typeof window !== 'undefined' && window.zofficeAPI?.recent?.clear) {
    try {
      await window.zofficeAPI.recent.clear()
      return true
    } catch (err) {
      console.error('[RecentFiles] Failed to clear:', err)
      return false
    }
  }
  return false
}
