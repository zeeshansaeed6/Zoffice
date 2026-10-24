/**
 * ZDraw SQLite storage operations via Electron preload bridge.
 * @module draw-storage
 */

/**
 * Persist diagram to local SQLite database.
 * @param {import('./draw-model.js').Diagram} diagram
 */
export async function saveDiagramToStorage(diagram) {
  const api = typeof window !== 'undefined' ? window.zofficeAPI || window.api : null
  if (api?.draw?.saveDiagram) {
    try {
      await api.draw.saveDiagram(diagram)
    } catch (err) {
      console.error('Failed to save diagram to SQLite:', err)
    }
  }
}

/**
 * Load diagram from local SQLite database by ID.
 * @param {string} id
 * @returns {Promise<import('./draw-model.js').Diagram|null>}
 */
export async function loadDiagramFromStorage(id) {
  const api = typeof window !== 'undefined' ? window.zofficeAPI || window.api : null
  if (api?.draw?.getDiagram) {
    try {
      return await api.draw.getDiagram(id)
    } catch (err) {
      console.error('Failed to load diagram from SQLite:', err)
    }
  }
  return null
}
