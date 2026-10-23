/**
 * Supported file extension patterns across Zoffice apps.
 * @type {readonly string[]}
 */
export const ALLOWED_EXTENSIONS = Object.freeze([
  'docx',
  'xlsx',
  'pptx',
  'odt',
  'ods',
  'txt',
  'md',
  'csv',
  'html',
  'rtf',
])

/**
 * Validate whether a filename or path has an allowed office extension.
 * @param {string} filePath - Absolute or relative file path
 * @returns {boolean}
 */
export function isAllowedExtension(filePath) {
  if (typeof filePath !== 'string') return false
  const match = filePath.match(/\.([a-zA-Z0-9]+)$/)
  if (!match) return false
  const ext = match[1].toLowerCase()
  return ALLOWED_EXTENSIONS.includes(ext)
}

/**
 * Open file dialog via Electron IPC with fallback.
 * @param {Object} [options]
 * @param {string} [options.appId] - e.g. 'writer', 'sheets', 'slides'
 * @returns {Promise<{ cancelled: boolean, filePath?: string, content?: string, title?: string }>}
 */
export async function openFile(options = {}) {
  if (typeof window !== 'undefined' && window.zofficeAPI?.file?.open) {
    return window.zofficeAPI.file.open(options)
  }
  return { cancelled: true }
}

/**
 * Save file via Electron IPC.
 * @param {string} filePath
 * @param {string} content
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function saveFile(filePath, content) {
  if (typeof window !== 'undefined' && window.zofficeAPI?.file?.save) {
    return window.zofficeAPI.file.save(filePath, content)
  }
  return { success: false, error: 'IPC unavailable' }
}

/**
 * Save As file dialog via Electron IPC.
 * @param {string} defaultName
 * @param {string} content
 * @param {string} [defaultExtension]
 * @returns {Promise<{ cancelled: boolean, filePath?: string }>}
 */
export async function saveFileAs(defaultName, content, defaultExtension = 'docx') {
  if (typeof window !== 'undefined' && window.zofficeAPI?.file?.saveAs) {
    return window.zofficeAPI.file.saveAs(defaultName, content, defaultExtension)
  }
  return { cancelled: true }
}
