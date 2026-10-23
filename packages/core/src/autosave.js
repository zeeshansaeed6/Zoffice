/**
 * @typedef {Object} AutosaveItem
 * @property {string} id - Tab / document unique ID
 * @property {string} title - Document title
 * @property {string} appId - App ID ('writer', 'sheets', 'slides')
 * @property {string|null} filePath - Real file path if previously saved
 * @property {string} content - Serialized document payload
 * @property {number} timestamp - Epoch milliseconds
 */

/**
 * Creates an autosave controller that periodically checks for dirty documents.
 *
 * @param {Object} config
 * @param {number} [config.intervalMs=30000] - Check interval in milliseconds (default: 30s)
 * @param {() => AutosaveItem[]} config.getDirtyDocuments - Provider for dirty documents
 * @param {(saved: AutosaveItem[]) => void} [config.onAutosaved] - Optional notification callback
 * @returns {{ start: () => void, stop: () => void, triggerNow: () => Promise<void> }}
 */
export function createAutosaveController({ intervalMs = 30000, getDirtyDocuments, onAutosaved }) {
  /** @type {ReturnType<typeof setInterval> | null} */
  let timerId = null

  async function performAutosave() {
    const dirty = getDirtyDocuments()
    if (!dirty || dirty.length === 0) return

    for (const doc of dirty) {
      if (typeof window !== 'undefined' && window.zofficeAPI?.autosave?.save) {
        await window.zofficeAPI.autosave.save({
          id: doc.id,
          title: doc.title,
          appId: doc.appId,
          filePath: doc.filePath,
          content: doc.content,
          timestamp: Date.now(),
        })
      }
    }

    if (onAutosaved) {
      onAutosaved(dirty)
    }
  }

  return {
    start() {
      if (timerId !== null) return
      timerId = setInterval(performAutosave, intervalMs)
    },
    stop() {
      if (timerId !== null) {
        clearInterval(timerId)
        timerId = null
      }
    },
    async triggerNow() {
      await performAutosave()
    },
  }
}
