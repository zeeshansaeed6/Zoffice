/**
 * ZBase SQLite storage operations via Electron preload bridge.
 * @module base-storage
 */

/**
 * Persist relational base to local SQLite database.
 * @param {import('./base-model.js').RelationalBase} base
 */
export async function saveBaseToStorage(base) {
  const api = typeof window !== 'undefined' ? window.zofficeAPI || window.api : null
  if (api?.base?.saveBase) {
    try {
      await api.base.saveBase(base)
    } catch (err) {
      console.error('Failed to save base to SQLite:', err)
    }
  }
}

/**
 * Load relational base from local SQLite database by ID.
 * @param {string} id
 * @returns {Promise<import('./base-model.js').RelationalBase|null>}
 */
export async function loadBaseFromStorage(id) {
  const api = typeof window !== 'undefined' ? window.zofficeAPI || window.api : null
  if (api?.base?.getBase) {
    try {
      return await api.base.getBase(id)
    } catch (err) {
      console.error('Failed to load base from SQLite:', err)
    }
  }
  return null
}

/**
 * List all saved bases.
 * @returns {Promise<Array<{ id: string, title: string, updatedAt: number }>>}
 */
export async function listBasesFromStorage() {
  const api = typeof window !== 'undefined' ? window.zofficeAPI || window.api : null
  if (api?.base?.listBases) {
    try {
      return await api.base.listBases()
    } catch (err) {
      console.error('Failed to list bases from SQLite:', err)
    }
  }
  return []
}
