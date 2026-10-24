/**
 * ZNotes database bridge — calls IPC channels for SQLite persistence.
 * Runs in the renderer process, delegates to main process via preload.
 * @module note-db
 */

/**
 * Get the notes API bridge from the preload.
 * @returns {Object}
 */
function getApi() {
  if (typeof window !== 'undefined' && window.zofficeAPI?.notes) {
    return window.zofficeAPI.notes
  }
  // Fallback for tests: return no-op stubs
  return {
    listNotebooks: async () => [],
    saveNotebook: async () => true,
    deleteNotebook: async () => true,
    listSections: async () => [],
    saveSection: async () => true,
    deleteSection: async () => true,
    listPages: async () => [],
    savePage: async () => true,
    deletePage: async () => true,
    listBlocks: async () => [],
    saveBlock: async () => true,
    deleteBlock: async () => true,
    searchPages: async () => [],
  }
}

/** @returns {Promise<Object[]>} */
export async function listNotebooks() {
  return getApi().listNotebooks()
}

/**
 * @param {Object} notebook
 * @returns {Promise<boolean>}
 */
export async function saveNotebook(notebook) {
  return getApi().saveNotebook(notebook)
}

/**
 * @param {string} id
 * @returns {Promise<boolean>}
 */
export async function deleteNotebook(id) {
  return getApi().deleteNotebook(id)
}

/**
 * @param {string} notebookId
 * @returns {Promise<Object[]>}
 */
export async function listSections(notebookId) {
  return getApi().listSections(notebookId)
}

/**
 * @param {Object} section
 * @returns {Promise<boolean>}
 */
export async function saveSection(section) {
  return getApi().saveSection(section)
}

/**
 * @param {string} id
 * @returns {Promise<boolean>}
 */
export async function deleteSection(id) {
  return getApi().deleteSection(id)
}

/**
 * @param {string} sectionId
 * @returns {Promise<Object[]>}
 */
export async function listPages(sectionId) {
  return getApi().listPages(sectionId)
}

/**
 * @param {Object} page
 * @returns {Promise<boolean>}
 */
export async function savePage(page) {
  return getApi().savePage(page)
}

/**
 * @param {string} id
 * @returns {Promise<boolean>}
 */
export async function deletePage(id) {
  return getApi().deletePage(id)
}

/**
 * @param {string} pageId
 * @returns {Promise<Object[]>}
 */
export async function listBlocks(pageId) {
  return getApi().listBlocks(pageId)
}

/**
 * @param {Object} block
 * @returns {Promise<boolean>}
 */
export async function saveBlock(block) {
  return getApi().saveBlock(block)
}

/**
 * @param {string} id
 * @returns {Promise<boolean>}
 */
export async function deleteBlock(id) {
  return getApi().deleteBlock(id)
}

/**
 * @param {string} query
 * @returns {Promise<Object[]>}
 */
export async function searchPages(query) {
  return getApi().searchPages(query)
}
