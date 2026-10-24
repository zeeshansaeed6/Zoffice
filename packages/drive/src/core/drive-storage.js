/**
 * ZDrive SQLite storage operations via Electron preload bridge.
 * @module drive-storage
 */

/**
 * Persist drive items catalog to SQLite database.
 * @param {import('./drive-model.js').DriveItem[]} items
 */
export async function saveDriveItemsToStorage(items) {
  const api = typeof window !== 'undefined' ? window.zofficeAPI || window.api : null
  if (api?.drive?.saveItems) {
    try {
      await api.drive.saveItems(items)
    } catch (err) {
      console.error('Failed to save drive items to SQLite:', err)
    }
  }
}

/**
 * Load drive items catalog from SQLite database.
 * @returns {Promise<import('./drive-model.js').DriveItem[]|null>}
 */
export async function loadDriveItemsFromStorage() {
  const api = typeof window !== 'undefined' ? window.zofficeAPI || window.api : null
  if (api?.drive?.getItems) {
    try {
      return await api.drive.getItems()
    } catch (err) {
      console.error('Failed to load drive items from SQLite:', err)
    }
  }
  return null
}
